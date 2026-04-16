import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { spawn, execSync } from 'child_process';
import archiver from 'archiver';
import unzipper from 'unzipper';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const DATA_PATH = process.env.DATA_PATH || __dirname;
const SERVERS_DIR = process.env.SERVERS_DIR || path.join(DATA_PATH, 'servers');
const CACHE_DIR = process.env.CACHE_DIR || path.join(DATA_PATH, 'cache');
const BACKUPS_DIR = process.env.BACKUPS_DIR || path.join(DATA_PATH, 'backups');

if (!fs.existsSync(SERVERS_DIR)) fs.mkdirSync(SERVERS_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

app.use(cors());
app.use(express.json());

const servers = new Map();
const consoleOutputs = new Map();
const downloadProgress = new Map();
const sessions = new Map();

const DEFAULT_ADMIN = { username: 'admin', password: 'admin123' };

function generateToken() {
  return uuidv4();
}

function authMiddleware(req, res, next) {
  const token = req.headers['x-session-token'];
  
  if (!token) {
    return res.status(401).json({ error: 'No session token provided' });
  }
  
  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  
  req.session = session;
  next();
}

const MINECRAFT_VERSIONS = [
  { id: '1.21.4', name: 'Minecraft 1.21.4', type: 'release' },
  { id: '1.21.3', name: 'Minecraft 1.21.3', type: 'release' },
  { id: '1.21.1', name: 'Minecraft 1.21.1', type: 'release' },
  { id: '1.20.6', name: 'Minecraft 1.20.6', type: 'release' },
  { id: '1.20.4', name: 'Minecraft 1.20.4', type: 'release' },
  { id: '1.20.2', name: 'Minecraft 1.20.2', type: 'release' },
  { id: '1.19.4', name: 'Minecraft 1.19.4', type: 'release' },
  { id: '1.18.2', name: 'Minecraft 1.18.2', type: 'release' },
  { id: '1.16.5', name: 'Minecraft 1.16.5', type: 'release' },
  { id: '1.12.2', name: 'Minecraft 1.12.2', type: 'release' },
];

const SERVER_TYPES = [
  { id: 'vanilla', name: 'Vanilla', description: 'Default Minecraft server' },
  { id: 'paper', name: 'Paper', description: 'Optimized for performance' },
  { id: 'spigot', name: 'Spigot', description: 'High performance with plugins (uses Paper)' },
  { id: 'purpur', name: 'Purpur', description: 'Fully configurable server' },
];

async function getVanillaJarUrl(version) {
  try {
    const manifestRes = await fetch('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');
    const manifest = await manifestRes.json();
    const versionInfo = manifest.versions.find(v => v.id === version);
    
    if (!versionInfo) return null;
    
    const versionRes = await fetch(versionInfo.url);
    const versionData = await versionRes.json();
    return versionData.downloads.server.url;
  } catch (error) {
    console.error('Error fetching Vanilla JAR URL:', error);
    return null;
  }
}

async function getPaperJarUrl(version) {
  try {
    const buildsRes = await fetch(`https://api.papermc.io/v2/projects/paper/versions/${version}/builds`);
    const buildsData = await buildsRes.json();
    const latestBuild = buildsData.builds[buildsData.builds.length - 1].build;
    return `https://api.papermc.io/v2/projects/paper/versions/${version}/builds/${latestBuild}/downloads/paper-${version}-${latestBuild}.jar`;
  } catch (error) {
    console.error('Error fetching Paper JAR URL:', error);
    return null;
  }
}

async function getPurpurJarUrl(version) {
  return `https://api.purpurmc.org/v2/purpur/${version}/latest/download`;
}

async function getJarUrl(version, type) {
  switch (type) {
    case 'vanilla':
      return await getVanillaJarUrl(version);
    case 'paper':
    case 'spigot': // Use Paper for Spigot as it's a drop-in replacement and easier to download
      return await getPaperJarUrl(version);
    case 'purpur':
      return await getPurpurJarUrl(version);
    default:
      return await getVanillaJarUrl(version);
  }
}

function getDefaultProperties(version) {
  return {
    'spawn-protection': 16,
    'max-chunk-validate-chunk-count': '1000000',
    'view-distance': 10,
    'simulation-distance': 10,
    'server-ip': '',
    'server-port': 25565,
    'enable-jmx-monitoring': false,
    'enable-status': true,
    'online-mode': true,
    'enable-command-block': false,
    'allow-nether': true,
    'allow-flight': false,
    'spawn-monsters': true,
    'hardcore': false,
    'allow-end': true,
    'server-name': 'Minecraft Server',
    'motd': 'A MineIDE Minecraft Server',
    'player-idle-timeout': 0,
    'difficulty': 2,
    'spawn-animals': true,
    'spawn-npcs': true,
    'pvp': true,
    'generate-structures': true,
    'op-permission-level': 4,
    'enable-rcon': false,
    'rcon.password': '',
    'rcon.port': 25575,
    'force-gamemode': false,
    'white-list': false,
    'enforce-whitelist': false,
    'max-players': 20,
    'max-tick-time': 60000,
    'seed': '',
    'resource-pack': '',
    'resource-pack-sha1': '',
    'prevent-proxy-connections': false,
    'use-native-transport': true,
  };
}

function createServerProperties(config) {
  const props = getDefaultProperties(config.version);
  Object.assign(props, {
    'server-name': config.name || 'Minecraft Server',
    'motd': config.motd || 'A MineIDE Minecraft Server',
    'server-port': config.port || 25565,
    'max-players': config.maxPlayers || 20,
    'difficulty': ['peaceful', 'easy', 'normal', 'hard'].indexOf(config.difficulty || 'normal'),
    'pvp': config.pvp !== false,
    'allow-flight': config.allowFlight || false,
    'white-list': config.whitelist || false,
    'spawn-animals': config.spawnAnimals !== false,
    'spawn-monsters': config.spawnMonsters !== false,
    'spawn-npcs': config.spawnNpcs !== false,
    'view-distance': config.viewDistance || 10,
    'seed': config.seed || '',
    'online-mode': config.onlineMode !== false,
  });
  
  let content = '';
  for (const [key, value] of Object.entries(props)) {
    content += `${key}=${value}\n`;
  }
  return content;
}

function initServerDirectory(serverId, config) {
  const serverPath = path.join(SERVERS_DIR, serverId);
  fs.mkdirSync(serverPath, { recursive: true });
  fs.mkdirSync(path.join(serverPath, 'plugins'), { recursive: true });
  fs.mkdirSync(path.join(serverPath, 'worlds'), { recursive: true });
  return serverPath;
}

async function downloadServerJar(serverId, version, type) {
  const jarPath = path.join(CACHE_DIR, `${type}-${version}.jar`);
  
  if (!fs.existsSync(jarPath)) {
    const downloadUrl = await getJarUrl(version, type);
    
    if (!downloadUrl) {
      throw new Error(`Could not find download URL for ${type} version ${version}`);
    }
    
    console.log(`Downloading ${type} ${version} from ${downloadUrl}...`);
    
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Failed to download from ${downloadUrl}: ${response.statusText}`);
      
      const fileStream = fs.createWriteStream(jarPath);
      
      // Use pipeline for robust stream handling and automatic resource cleanup
      await pipeline(
        Readable.fromWeb(response.body),
        fileStream
      );
      
      console.log(`Successfully downloaded ${jarPath}`);
    } catch (err) {
      console.error(`Download failed: ${err.message}`);
      // Clean up partial file on failure
      if (fs.existsSync(jarPath)) fs.unlinkSync(jarPath);
      throw err;
    }
    downloadProgress.delete(serverId);
  }
  
  return jarPath;
}

app.get('/api/versions', (req, res) => {
  res.json(MINECRAFT_VERSIONS);
});

app.get('/api/server-types', (req, res) => {
  res.json(SERVER_TYPES);
});

app.get('/api/servers', authMiddleware, (req, res) => {
  const serverList = [];
  const dirs = fs.readdirSync(SERVERS_DIR);
  
  for (const dir of dirs) {
    const serverPath = path.join(SERVERS_DIR, dir);
    const configPath = path.join(serverPath, 'config.json');
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const isRunning = servers.has(dir);
      serverList.push({
        id: dir,
        ...config,
        status: isRunning ? 'running' : 'stopped',
        process: isRunning ? true : false,
      });
    }
  }
  
  res.json(serverList);
});

app.post('/api/servers', authMiddleware, async (req, res) => {
  try {
    const { name, version, type, port, maxPlayers, difficulty, pvp, whitelist, allowFlight, spawnAnimals, spawnMonsters, spawnNpcs, viewDistance, seed, motd, onlineMode, ram } = req.body;
    
    if (!name || !version || !type) {
      return res.status(400).json({ error: 'Missing required fields: name, version, type' });
    }
    
    const serverId = uuidv4();
    const serverPath = initServerDirectory(serverId, { name, version });
    
    // Download server JAR
    await downloadServerJar(serverId, version, type);
    const jarPath = path.join(CACHE_DIR, `${type}-${version}.jar`);
    const serverJarPath = path.join(serverPath, 'server.jar');
    fs.copyFileSync(jarPath, serverJarPath);
    
    // Create eula.txt
    fs.writeFileSync(path.join(serverPath, 'eula.txt'), 'eula=true\n');
    
    // Create server.properties
    fs.writeFileSync(path.join(serverPath, 'server.properties'), createServerProperties({
      name, version, port, maxPlayers, difficulty, pvp, whitelist, allowFlight, spawnAnimals, spawnMonsters, spawnNpcs, viewDistance, seed, motd, onlineMode
    }));
    
    // Create start script
    const ramMB = ram || 2048;
    const startScript = type === 'paper' 
      ? `java -Xmx${ramMB}M -Xms${Math.max(512, ramMB / 4)}M -jar paper-${version}-latest.jar nogui`
      : `java -Xmx${ramMB}M -Xms${Math.max(512, ramMB / 4)}M -jar server.jar nogui`;
    
    fs.writeFileSync(path.join(serverPath, 'start.sh'), startScript);
    fs.writeFileSync(path.join(serverPath, 'start.bat'), startScript.replace(/\//g, '\\'));
    
    // Save config
    const config = {
      name, version, type, port, maxPlayers, difficulty, pvp, whitelist, allowFlight, spawnAnimals, spawnMonsters, spawnNpcs, viewDistance, seed, motd, onlineMode, ram: ramMB,
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(serverPath, 'config.json'), JSON.stringify(config, null, 2));
    
    consoleOutputs.set(serverId, []);
    
    res.json({ id: serverId, ...config, status: 'stopped' });
  } catch (error) {
    console.error('Error creating server:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/servers/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const serverPath = path.join(SERVERS_DIR, id);
  const configPath = path.join(serverPath, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const isRunning = servers.has(id);
  const propertiesPath = path.join(serverPath, 'server.properties');
  
  let properties = {};
  if (fs.existsSync(propertiesPath)) {
    const content = fs.readFileSync(propertiesPath, 'utf-8');
    content.split('\n').forEach(line => {
      if (line.includes('=')) {
        const [key, value] = line.split('=');
        properties[key.trim()] = value?.trim();
      }
    });
  }
  
  res.json({
    id,
    ...config,
    status: isRunning ? 'running' : 'stopped',
    properties
  });
});

app.post('/api/servers/:id/start', authMiddleware, (req, res) => {
  const { id } = req.params;
  const serverPath = path.join(SERVERS_DIR, id);
  const configPath = path.join(serverPath, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  if (servers.has(id)) {
    return res.status(400).json({ error: 'Server already running' });
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const jarPath = path.join(serverPath, 'server.jar');
  
  if (!fs.existsSync(jarPath)) {
    return res.status(400).json({ error: 'Server JAR not found. Please reinstall.' });
  }
  
  const ramMB = config.ram || 2048;
  const javaArgs = [
    '-Xmx' + ramMB + 'M',
    '-Xms' + Math.max(512, Math.floor(ramMB / 4)) + 'M',
    '-jar',
    config.type === 'paper' ? `paper-${config.version}-latest.jar` : 'server.jar',
    'nogui'
  ];
  
  const proc = spawn('java', javaArgs, {
    cwd: serverPath,
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  servers.set(id, proc);
  consoleOutputs.set(id, []);
  
  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    const output = consoleOutputs.get(id) || [];
    output.push(...lines.filter(l => l.trim()));
    if (output.length > 500) output.shift();
    consoleOutputs.set(id, output);
  });
  
  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    const output = consoleOutputs.get(id) || [];
    output.push(...lines.filter(l => l.trim()).map(l => '[ERR] ' + l));
    if (output.length > 500) output.shift();
    consoleOutputs.set(id, output);
  });
  
  proc.on('close', (code) => {
    servers.delete(id);
    const output = consoleOutputs.get(id) || [];
    output.push(`[PROCESS] Server stopped with code ${code}`);
    consoleOutputs.set(id, output);
  });
  
  res.json({ status: 'starting' });
});

app.post('/api/servers/:id/stop', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  if (!servers.has(id)) {
    return res.status(400).json({ error: 'Server not running' });
  }
  
  const proc = servers.get(id);
  proc.stdin.write('stop\n');
  
  setTimeout(() => {
    if (servers.has(id)) {
      proc.kill();
    }
  }, 10000);
  
  res.json({ status: 'stopping' });
});

app.post('/api/servers/:id/restart', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  if (servers.has(id)) {
    const proc = servers.get(id);
    proc.stdin.write('stop\n');
  }
  
  setTimeout(() => {
    const serverPath = path.join(SERVERS_DIR, id);
    const configPath = path.join(serverPath, 'config.json');
    
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const ramMB = config.ram || 2048;
      
      const proc = spawn('java', [
        '-Xmx' + ramMB + 'M',
        '-Xms' + Math.max(512, Math.floor(ramMB / 4)) + 'M',
        '-jar',
        config.type === 'paper' ? `paper-${config.version}-latest.jar` : 'server.jar',
        'nogui'
      ], { cwd: serverPath, stdio: ['pipe', 'pipe', 'pipe'] });
      
      servers.set(id, proc);
      
      proc.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        const output = consoleOutputs.get(id) || [];
        output.push(...lines.filter(l => l.trim()));
        if (output.length > 500) output.shift();
        consoleOutputs.set(id, output);
      });
      
      proc.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        const output = consoleOutputs.get(id) || [];
        output.push(...lines.filter(l => l.trim()).map(l => '[ERR] ' + l));
        if (output.length > 500) output.shift();
        consoleOutputs.set(id, output);
      });
      
      proc.on('close', () => servers.delete(id));
    }
  }, 5000);
  
  res.json({ status: 'restarting' });
});

app.post('/api/servers/:id/command', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { command } = req.body;
  
  if (!servers.has(id)) {
    return res.status(400).json({ error: 'Server not running' });
  }
  
  const proc = servers.get(id);
  proc.stdin.write(command + '\n');
  
  res.json({ sent: true });
});

app.get('/api/servers/:id/console', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  if (!consoleOutputs.has(id)) {
    return res.json([]);
  }
  
  const since = parseInt(req.query.since || '0');
  const output = consoleOutputs.get(id) || [];
  const filtered = output.slice(since);
  
  res.json({
    output: filtered,
    count: output.length
  });
});

app.get('/api/servers/:id/download-progress', authMiddleware, (req, res) => {
  const { id } = req.params;
  res.json({ progress: downloadProgress.get(id) || 0 });
});

app.put('/api/servers/:id/config', authMiddleware, (req, res) => {
  const { id } = req.params;
  const serverPath = path.join(SERVERS_DIR, id);
  const configPath = path.join(serverPath, 'config.json');
  
  if (!fs.existsSync(configPath)) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const newConfig = { ...config, ...req.body };
  
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
  fs.writeFileSync(path.join(serverPath, 'server.properties'), createServerProperties(newConfig));
  
  res.json({ success: true });
});

app.delete('/api/servers/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  
  if (servers.has(id)) {
    return res.status(400).json({ error: 'Stop server before deleting' });
  }
  
  const serverPath = path.join(SERVERS_DIR, id);
  if (fs.existsSync(serverPath)) {
    fs.rmSync(serverPath, { recursive: true, force: true });
  }
  
  res.json({ deleted: true });
});

app.post('/api/servers/:id/backup', authMiddleware, (req, res) => {
  const { id } = req.params;
  const serverPath = path.join(SERVERS_DIR, id);
  const backupPath = path.join(BACKUPS_DIR, `${id}-${Date.now()}.zip`);
  
  if (!fs.existsSync(serverPath)) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  const output = fs.createWriteStream(backupPath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  archive.pipe(output);
  archive.directory(path.join(serverPath, 'world'), 'world');
  archive.file(path.join(serverPath, 'server.properties'), { name: 'server.properties' });
  
  archive.finalize();
  
  output.on('close', () => {
    res.json({ backupPath: backupPath, size: archive.pointer() });
  });
  
  archive.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

app.get('/api/servers/:id/files', authMiddleware, (req, res) => {
  const { id } = req.params;
  const serverPath = path.join(SERVERS_DIR, id);
  
  if (!fs.existsSync(serverPath)) {
    return res.status(404).json({ error: 'Server not found' });
  }
  
  const files = [];
  const walkDir = (dir, base = '') => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item === 'cache' || item === 'logs' || item === 'crash-reports') continue;
      const fullPath = path.join(dir, item);
      const relativePath = path.join(base, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push({ path: relativePath, type: 'directory', size: 0 });
        walkDir(fullPath, relativePath);
      } else {
        files.push({ path: relativePath, type: 'file', size: stat.size });
      }
    }
  };
  
  walkDir(serverPath);
  res.json(files);
});

app.get('/api/servers/:id/plugins', authMiddleware, (req, res) => {
  const { id } = req.params;
  const serverPath = path.join(SERVERS_DIR, id);
  const pluginsPath = path.join(serverPath, 'plugins');
  
  if (!fs.existsSync(pluginsPath)) {
    return res.json([]);
  }
  
  const plugins = fs.readdirSync(pluginsPath)
    .filter(f => f.endsWith('.jar'))
    .map(f => ({
      name: f.replace('.jar', ''),
      file: f,
      size: fs.statSync(path.join(pluginsPath, f)).size
    }));
  
  res.json(plugins);
});

app.post('/api/servers/:id/plugins', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { pluginUrl, pluginName } = req.body;
  
  if (!pluginUrl) {
    return res.status(400).json({ error: 'Plugin URL required' });
  }
  
  const serverPath = path.join(SERVERS_DIR, id);
  const pluginsPath = path.join(serverPath, 'plugins');
  const filename = pluginName || pluginUrl.split('/').pop();
  const pluginPath = path.join(pluginsPath, filename);
  
  // For demo, we'll just create a placeholder
  // In production, you'd download the actual plugin
  fs.writeFileSync(pluginPath, `Plugin placeholder: ${filename}`);
  
  res.json({ installed: filename });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  if (username !== DEFAULT_ADMIN.username || password !== DEFAULT_ADMIN.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = generateToken();
  sessions.set(token, {
    username,
    createdAt: Date.now()
  });
  
  res.json({ token, username });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['x-session-token'];
  if (token) {
    sessions.delete(token);
  }
  res.json({ success: true });
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, username: req.session.username });
});

// Health check (no auth required)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', servers: servers.size });
});

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const serverId = url.searchParams.get('serverId');
  
  if (!serverId || !servers.has(serverId)) {
    ws.close();
    return;
  }
  
  const output = consoleOutputs.get(serverId) || [];
  ws.send(JSON.stringify({ type: 'history', data: output }));
  
  const interval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      const current = consoleOutputs.get(serverId) || [];
      ws.send(JSON.stringify({ type: 'update', data: current.slice(-50) }));
    }
  }, 1000);
  
  ws.on('message', (message) => {
    const proc = servers.get(serverId);
    if (proc) {
      proc.stdin.write(message.toString() + '\n');
    }
  });
  
  ws.on('close', () => clearInterval(interval));
});

httpServer.listen(PORT, () => {
  console.log(`MineIDE Minecraft Service running on port ${PORT}`);
});