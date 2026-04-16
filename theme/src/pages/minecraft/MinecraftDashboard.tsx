import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { minecraftApi } from '@/api/minecraft';
import type { MinecraftServer } from '@/api/minecraft';
import { Plus, Server, Play, Square, Trash2, Settings, RefreshCw, Box } from 'lucide-react';

export const MinecraftDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [servers, setServers] = useState<MinecraftServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchServers = async () => {
    try {
      const data = await minecraftApi.getServers();
      setServers(data);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async (id: string) => {
    setActionLoading(id);
    try {
      await minecraftApi.startServer(id);
      fetchServers();
    } catch (error) {
      console.error('Failed to start server:', error);
    }
    setActionLoading(null);
  };

  const handleStop = async (id: string) => {
    setActionLoading(id);
    try {
      await minecraftApi.stopServer(id);
      fetchServers();
    } catch (error) {
      console.error('Failed to stop server:', error);
    }
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this server?')) return;
    try {
      await minecraftApi.deleteServer(id);
      fetchServers();
    } catch (error) {
      console.error('Failed to delete server:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Minecraft" description="Create and manage local Minecraft servers" />
        <div className="flex items-center justify-center p-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Minecraft" description="Create and manage local Minecraft servers" />
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--muted-foreground)]">{servers.length} server(s)</span>
          </div>
          <Button onClick={() => navigate('/minecraft/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Server
          </Button>
        </div>

        {servers.length === 0 ? (
          <Card className="border-dashed border-2 border-[var(--border)]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-20 w-20 rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center mb-6">
                <Box className="h-10 w-10 text-[var(--theme-primary)]" />
              </div>
              <p className="text-xl font-bold text-[var(--foreground)] mb-2">No servers yet</p>
              <p className="text-sm text-[var(--muted-foreground)] mb-6 text-center max-w-sm">
                Create your first Minecraft server to start playing with friends
              </p>
              <Button onClick={() => navigate('/minecraft/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Server
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <Card key={server.id} className="group hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${server.status === 'running' ? 'bg-[var(--theme-primary)]/10' : 'bg-[var(--secondary)]'}`}>
                        <Server className={`h-6 w-6 ${server.status === 'running' ? 'text-[var(--theme-primary)]' : 'text-[var(--muted-foreground)]'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{server.name}</CardTitle>
                        <p className="text-sm text-[var(--muted-foreground)]">{server.version} - {server.type}</p>
                      </div>
                    </div>
                    <Badge variant={server.status === 'running' ? 'success' : 'secondary'}>
                      {server.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="p-3 rounded-xl bg-[var(--secondary)]">
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">Port</p>
                      <p className="font-bold text-[var(--foreground)]">{server.port}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--secondary)]">
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">Max Players</p>
                      <p className="font-bold text-[var(--foreground)]">{server.maxPlayers}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--secondary)]">
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">RAM</p>
                      <p className="font-bold text-[var(--foreground)]">{server.ram}MB</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--secondary)]">
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">Difficulty</p>
                      <p className="font-bold text-[var(--foreground)] capitalize">{server.difficulty}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {server.status === 'running' ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStop(server.id)}
                        disabled={actionLoading === server.id}
                      >
                        {actionLoading === server.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Square className="h-4 w-4 mr-1" />
                        )}
                        Stop
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleStart(server.id)}
                        disabled={actionLoading === server.id}
                      >
                        {actionLoading === server.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        Start
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/minecraft/console/${server.id}`)}
                      className="hover:bg-[var(--theme-primary)]/10"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(server.id)}
                      className="hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};