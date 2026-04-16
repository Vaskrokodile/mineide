const MINECRAFT_API = import.meta.env.VITE_MINECRAFT_API_URL || 'http://localhost:3001';

interface MinecraftServer {
  id: string;
  name: string;
  version: string;
  type: string;
  port: number;
  maxPlayers: number;
  difficulty: string;
  pvp: boolean;
  whitelist: boolean;
  allowFlight: boolean;
  spawnAnimals: boolean;
  spawnMonsters: boolean;
  spawnNpcs: boolean;
  viewDistance: number;
  seed: string;
  motd: string;
  onlineMode: boolean;
  ram: number;
  status: 'running' | 'stopped';
  createdAt: string;
}

interface CreateServerRequest {
  name: string;
  version: string;
  type: string;
  port?: number;
  maxPlayers?: number;
  difficulty?: string;
  pvp?: boolean;
  whitelist?: boolean;
  allowFlight?: boolean;
  spawnAnimals?: boolean;
  spawnMonsters?: boolean;
  spawnNpcs?: boolean;
  viewDistance?: number;
  seed?: string;
  motd?: string;
  onlineMode?: boolean;
  ram?: number;
}

export const minecraftApi = {
  getVersions: async () => {
    const res = await fetch(`${MINECRAFT_API}/api/versions`);
    return res.json();
  },

  getServerTypes: async () => {
    const res = await fetch(`${MINECRAFT_API}/api/server-types`);
    return res.json();
  },

  getServers: async (): Promise<MinecraftServer[]> => {
    const res = await fetch(`${MINECRAFT_API}/api/servers`);
    return res.json();
  },

  getServer: async (id: string): Promise<MinecraftServer> => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}`);
    return res.json();
  },

  createServer: async (data: CreateServerRequest): Promise<MinecraftServer> => {
    const res = await fetch(`${MINECRAFT_API}/api/servers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  startServer: async (id: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/start`, { method: 'POST' });
    return res.json();
  },

  stopServer: async (id: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/stop`, { method: 'POST' });
    return res.json();
  },

  restartServer: async (id: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/restart`, { method: 'POST' });
    return res.json();
  },

  sendCommand: async (id: string, command: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    return res.json();
  },

  getConsole: async (id: string, since = 0) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/console?since=${since}`);
    return res.json();
  },

  updateConfig: async (id: string, config: Partial<MinecraftServer>) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },

  deleteServer: async (id: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}`, { method: 'DELETE' });
    return res.json();
  },

  backupServer: async (id: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/backup`, { method: 'POST' });
    return res.json();
  },

  getPlugins: async (id: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/plugins`);
    return res.json();
  },

  installPlugin: async (id: string, pluginUrl: string, pluginName?: string) => {
    const res = await fetch(`${MINECRAFT_API}/api/servers/${id}/plugins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pluginUrl, pluginName }),
    });
    return res.json();
  },
};

export type { MinecraftServer, CreateServerRequest };