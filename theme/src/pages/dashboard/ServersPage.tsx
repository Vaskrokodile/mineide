import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, MoreHorizontal, Server } from 'lucide-react';

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
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-[var(--muted-foreground)]">Total: {servers.length} servers</p>
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create Server
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <Card key={server.id} className="group hover:shadow-card-hover transition-all duration-200 cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-lg bg-[var(--theme-primary)]/10 flex items-center justify-center group-hover:bg-[var(--theme-primary)]/20 transition-colors">
                    <Server className="h-4 w-4 text-[var(--theme-primary)]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{server.name}</CardTitle>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{server.node}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={server.status === 'online' ? 'success' : 'secondary'}>
                    {server.status}
                  </Badge>
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <div className="p-1.5 rounded-md bg-[var(--secondary)]">
                      <p className="text-[10px] text-[var(--muted-foreground)]">Egg</p>
                      <p className="font-medium text-[var(--foreground)] truncate">{server.egg}</p>
                    </div>
                    <div className="p-1.5 rounded-md bg-[var(--secondary)]">
                      <p className="text-[10px] text-[var(--muted-foreground)]">Memory</p>
                      <p className="font-medium text-[var(--foreground)]">{server.memory}MB</p>
                    </div>
                    <div className="p-1.5 rounded-md bg-[var(--secondary)]">
                      <p className="text-[10px] text-[var(--muted-foreground)]">Disk</p>
                      <p className="font-medium text-[var(--foreground)]">{server.disk}MB</p>
                    </div>
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