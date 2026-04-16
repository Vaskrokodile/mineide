import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { minecraftApi } from '@/api/minecraft';
import type { MinecraftServer } from '@/api/minecraft';
import { Plus, Server, Play, Square, Trash2, Settings, RefreshCw } from 'lucide-react';

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
        <Header title="Minecraft" description="Manage your local Minecraft servers" />
        <div className="flex items-center justify-center p-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Minecraft" description="Manage your local Minecraft servers" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">{servers.length} server(s)</p>
          <Button onClick={() => navigate('/minecraft/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Server
          </Button>
        </div>

        {servers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Server className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No servers yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first Minecraft server to get started
              </p>
              <Button onClick={() => navigate('/minecraft/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Server
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servers.map((server) => (
              <Card key={server.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Server className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{server.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {server.version} - {server.type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={server.status === 'running' ? 'success' : 'default'}>
                    {server.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Port</span>
                      <span className="font-medium">{server.port}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Players</span>
                      <span className="font-medium">{server.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">RAM</span>
                      <span className="font-medium">{server.ram}MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty</span>
                      <span className="font-medium capitalize">{server.difficulty}</span>
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
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(server.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
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