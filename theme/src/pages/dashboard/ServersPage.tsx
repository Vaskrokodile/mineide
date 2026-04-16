import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, MoreHorizontal } from 'lucide-react';

const servers = [
  { id: 1, name: 'mc-hypixel-1', status: 'online', node: 'us-east-1', egg: 'Minecraft Java', memory: 4096, disk: 10240 },
  { id: 2, name: 'valheim-world-3', status: 'online', node: 'eu-west-1', egg: 'Valheim', memory: 8192, disk: 20480 },
  { id: 3, name: 'css-rank-2', status: 'offline', node: 'us-west-2', egg: 'Counter-Strike 2', memory: 2048, disk: 5120 },
  { id: 4, name: 'gta-five-moderated', status: 'online', node: 'us-east-1', egg: 'FiveM', memory: 16384, disk: 51200 },
];

export const ServersPage: React.FC = () => {
  return (
    <div>
      <Header title="Servers" description="Manage your game servers" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Total: {servers.length} servers</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Server
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <Card key={server.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{server.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{server.node}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Badge variant={server.status === 'online' ? 'success' : 'default'}>
                    {server.status}
                  </Badge>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Egg:</span> {server.egg}</p>
                    <p><span className="text-muted-foreground">Memory:</span> {server.memory}MB</p>
                    <p><span className="text-muted-foreground">Disk:</span> {server.disk}MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};