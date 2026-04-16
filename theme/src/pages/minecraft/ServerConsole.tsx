import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { minecraftApi } from '@/api/minecraft';
import type { MinecraftServer } from '@/api/minecraft';
import { ArrowLeft, Play, Square, RefreshCw, Download } from 'lucide-react';

export const ServerConsole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [server, setServer] = useState<MinecraftServer | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchServer = useCallback(async () => {
    if (!id) return;
    try {
      const data = await minecraftApi.getServer(id);
      setServer(data);
    } catch (error) {
      console.error('Failed to fetch server:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchServer();
  }, [fetchServer]);

  useEffect(() => {
    if (!id || server?.status !== 'running') return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//localhost:3001?serverId=${id}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history' || data.type === 'update') {
        setConsoleOutput(data.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      fetchServer();
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [id, server?.status, fetchServer]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const sendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || !wsRef.current) return;

    wsRef.current.send(command);
    setCommand('');
  };

  const handleStart = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await minecraftApi.startServer(id);
      fetchServer();
    } catch (error) {
      console.error('Failed to start server:', error);
    }
    setActionLoading(false);
  };

  const handleStop = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await minecraftApi.stopServer(id);
      if (wsRef.current) {
        wsRef.current.close();
      }
      fetchServer();
    } catch (error) {
      console.error('Failed to stop server:', error);
    }
    setActionLoading(false);
  };

  const handleBackup = async () => {
    if (!id) return;
    try {
      const result = await minecraftApi.backupServer(id);
      alert(`Backup created! Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.error('Failed to backup server:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Server Console" />
        <div className="flex items-center justify-center p-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div>
        <Header title="Server Not Found" />
        <div className="p-6">
          <p>Server not found.</p>
          <Button onClick={() => navigate('/minecraft')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={server.name}
        description={`${server.version} - ${server.type} | Port ${server.port}`}
      />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/minecraft')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Badge variant={server.status === 'running' ? 'success' : 'default'}>
              {server.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleBackup}>
              <Download className="h-4 w-4 mr-1" />
              Backup
            </Button>
            {server.status === 'running' ? (
              <Button variant="destructive" onClick={handleStop} disabled={actionLoading}>
                {actionLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                Stop
              </Button>
            ) : (
              <Button onClick={handleStart} disabled={actionLoading}>
                {actionLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-1" />
                )}
                Start
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Console</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              ref={consoleRef}
              className="h-96 bg-black rounded-lg p-4 font-mono text-sm overflow-y-auto"
            >
              {consoleOutput.length === 0 ? (
                <p className="text-gray-500">
                  {server.status === 'running'
                    ? 'Waiting for output...'
                    : 'Server is offline. Start the server to see console output.'}
                </p>
              ) : (
                consoleOutput.map((line, i) => (
                  <p
                    key={i}
                    className={`${
                      line.includes('[ERR]') || line.includes('ERROR')
                        ? 'text-red-400'
                        : line.includes('WARN')
                        ? 'text-yellow-400'
                        : line.startsWith('[PROCESS]')
                        ? 'text-blue-400'
                        : 'text-green-400'
                    }`}
                  >
                    {line}
                  </p>
                ))
              )}
            </div>

            {server.status === 'running' ? (
              <form onSubmit={sendCommand} className="flex gap-2">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Enter command (e.g., op player, give player diamond)"
                  className="font-mono"
                />
                <Button type="submit">Send</Button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground text-center">
                Start the server to send commands
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Server Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>{server.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{server.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RAM</span>
                <span>{server.ram}MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Players</span>
                <span>{server.maxPlayers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Gameplay Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="capitalize">{server.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PvP</span>
                <span>{server.pvp ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Whitelist</span>
                <span>{server.whitelist ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Online Mode</span>
                <span>{server.onlineMode ? 'Enabled' : 'Disabled'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};