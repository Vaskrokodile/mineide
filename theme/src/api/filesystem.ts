export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: number;
}

export interface FileContent {
  path: string;
  content: string;
  language?: string;
}

const SUPPORTED_EXTENSIONS: Record<string, string> = {
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.json': 'json',
  '.html': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.py': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.kt': 'kotlin',
  '.swift': 'swift',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.md': 'markdown',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.xml': 'xml',
  '.sql': 'sql',
  '.sh': 'bash',
  '.bash': 'bash',
  '.zsh': 'bash',
  '.php': 'php',
  '.vue': 'vue',
  '.svelte': 'svelte',
};

function getLanguage(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return SUPPORTED_EXTENSIONS[ext] || 'text';
}

export class FileSystemService {
  private basePath: string = '';

  setBasePath(path: string) {
    this.basePath = path;
  }

  getBasePath(): string {
    return this.basePath;
  }

  async readFile(path: string): Promise<FileContent> {
    if (!window.fs) throw new Error('File system not available');
    try {
      const content = await window.fs.readFile(path, 'utf8');
      return {
        path,
        content,
        language: getLanguage(path),
      };
    } catch (error) {
      throw new Error(`Failed to read file: ${path}`);
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!window.fs) throw new Error('File system not available');
    try {
      await window.fs.writeFile(path, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file: ${path}`);
    }
  }

  async listDirectory(path: string): Promise<FileInfo[]> {
    if (!window.fs) throw new Error('File system not available');
    try {
      const entries = await window.fs.readdir(path, { withFileTypes: true });
      return entries.map(entry => ({
        name: entry.name,
        path: `${path}/${entry.name}`.replace(/\/+/g, '/'),
        type: (entry.isDirectory() ? 'directory' : 'file') as 'directory' | 'file',
      })).sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      });
    } catch (error) {
      throw new Error(`Failed to list directory: ${path}`);
    }
  }

  async fileExists(path: string): Promise<boolean> {
    if (!window.fs) return false;
    try {
      await window.fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async getFileInfo(path: string): Promise<FileInfo> {
    if (!window.fs) throw new Error('File system not available');
    const stats = await window.fs.stat(path);
    return {
      name: path.split('/').pop() || '',
      path,
      type: stats.isDirectory() ? 'directory' : 'file',
      size: stats.size,
      modified: stats.mtimeMs,
    };
  }
}

declare global {
  interface Window {
    fs?: {
      readFile: (path: string, encoding: string) => Promise<string>;
      writeFile: (path: string, content: string, encoding: string) => Promise<void>;
      readdir: (path: string, options?: { withFileTypes?: boolean }) => Promise<any[]>;
      access: (path: string) => Promise<void>;
      stat: (path: string) => Promise<{ isDirectory: () => boolean; size: number; mtimeMs: number }>;
    };
  }
}
