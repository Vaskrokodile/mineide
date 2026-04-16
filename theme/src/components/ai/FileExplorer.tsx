import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { FolderOpen, File, ChevronRight, ChevronDown, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { FileInfo, FileContent } from '@/api/filesystem';

interface FileExplorerProps {
  onSelectFiles: (files: FileContent[]) => void;
  onClose: () => void;
  selectedFiles: FileContent[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  onSelectFiles,
  onClose,
  selectedFiles,
}) => {
  const [currentPath, setCurrentPath] = useState('/');
  const [entries, setEntries] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [directoryCache, setDirectoryCache] = useState<Record<string, FileInfo[]>>({});

  useEffect(() => {
    if (window.fs) {
      loadDirectory(currentPath);
    } else {
      setEntries(getMockEntries(currentPath));
    }
  }, [currentPath]);

  const loadDirectory = async (path: string) => {
    setLoading(true);
    try {
      let entries: FileInfo[];
      if (window.fs) {
        entries = await window.fs.readdir(path, { withFileTypes: true }).then(ents =>
          ents.map(e => ({
            name: e.name,
            path: `${path}/${e.name}`.replace(/\/+/g, '/'),
            type: e.isDirectory() ? 'directory' as const : 'file' as const,
          }))
        );
      } else {
        entries = getMockEntries(path);
      }
      entries.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'directory' ? -1 : 1;
      });
      setEntries(entries);
      setDirectoryCache(prev => ({ ...prev, [path]: entries }));
    } catch (error) {
      console.error('Failed to load directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMockEntries = (path: string): FileInfo[] => {
    const mockFiles: Record<string, FileInfo[]> = {
      '/': [
        { name: 'src', path: '/src', type: 'directory' },
        { name: 'package.json', path: '/package.json', type: 'file' },
        { name: 'README.md', path: '/README.md', type: 'file' },
      ],
      '/src': [
        { name: 'components', path: '/src/components', type: 'directory' },
        { name: 'pages', path: '/src/pages', type: 'directory' },
        { name: 'index.ts', path: '/src/index.ts', type: 'file' },
      ],
      '/src/components': [
        { name: 'Button.tsx', path: '/src/components/Button.tsx', type: 'file' },
        { name: 'Card.tsx', path: '/src/components/Card.tsx', type: 'file' },
      ],
      '/src/pages': [
        { name: 'Dashboard.tsx', path: '/src/pages/Dashboard.tsx', type: 'file' },
        { name: 'Settings.tsx', path: '/src/pages/Settings.tsx', type: 'file' },
      ],
    };
    return mockFiles[path] || [];
  };

  const toggleDirectory = (path: string) => {
    setExpandedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
        if (!directoryCache[path]) {
          setCurrentPath(path);
        }
      }
      return next;
    });
  };

  const handleFileClick = async (file: FileInfo) => {
    if (file.type === 'directory') {
      toggleDirectory(file.path);
      setCurrentPath(file.path);
    } else {
      const alreadySelected = selectedFiles.some(f => f.path === file.path);
      if (alreadySelected) {
        onSelectFiles(selectedFiles.filter(f => f.path !== file.path));
      } else {
        let content = '';
        if (window.fs) {
          try {
            content = await window.fs.readFile(file.path, 'utf8');
          } catch {
            content = `// Content for ${file.path}`;
          }
        } else {
          content = `// Content for ${file.path}\n// This is mock content for demonstration`;
        }

        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        const langMap: Record<string, string> = {
          '.tsx': 'typescript', '.ts': 'typescript', '.jsx': 'javascript',
          '.js': 'javascript', '.json': 'json', '.css': 'css', '.html': 'html',
        };

        onSelectFiles([...selectedFiles, {
          path: file.path,
          content,
          language: langMap[ext] || 'text',
        }]);
      }
    }
  };

  const isSelected = (path: string) => selectedFiles.some(f => f.path === path);
  const isExpanded = (path: string) => expandedDirs.has(path);

  const renderEntry = (entry: FileInfo, depth: number = 0) => {
    const selected = isSelected(entry.path);
    const expanded = isExpanded(entry.path);

    return (
      <div key={entry.path}>
        <div
          className={clsx(
            'flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer text-xs',
            'hover:bg-[var(--secondary)] transition-colors',
            selected && 'bg-[var(--theme-primary)]/10'
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => handleFileClick(entry)}
        >
          {entry.type === 'directory' ? (
            <>
              {expanded ? (
                <ChevronDown className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
              )}
              <FolderOpen className="h-4 w-4 text-[var(--theme-primary)]" />
            </>
          ) : (
            <>
              <span className="w-3.5" />
              <File className="h-4 w-4 text-[var(--muted-foreground)]" />
            </>
          )}
          <span className={clsx(
            'truncate',
            selected ? 'text-[var(--theme-primary)] font-medium' : 'text-[var(--foreground)]'
          )}>
            {entry.name}
          </span>
          {selected && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)]" />
          )}
        </div>
        {entry.type === 'directory' && expanded && directoryCache[entry.path] && (
          <div>
            {directoryCache[entry.path].map(child => renderEntry(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4 text-[var(--theme-primary)]" />
          <span className="text-sm font-medium">Select Files</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => loadDirectory(currentPath)}
            className="h-7 w-7"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="p-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] px-2">
          <span>Current:</span>
          <span className="font-mono text-[var(--foreground)]">{currentPath}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
          </div>
        ) : (
          entries.map(entry => renderEntry(entry))
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="border-t border-[var(--border)] p-3">
          <div className="text-[10px] font-medium text-[var(--muted-foreground)] mb-2">
            Selected Files ({selectedFiles.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedFiles.map(file => (
              <span
                key={file.path}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--theme-primary)]/10 text-[10px] text-[var(--theme-primary)]"
              >
                {file.path.split('/').pop()}
                <button
                  onClick={() => onSelectFiles(selectedFiles.filter(f => f.path !== file.path))}
                  className="hover:text-[var(--theme-primary)]"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
