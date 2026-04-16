import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, HardDrive } from 'lucide-react';

const nodes = [
  { id: 1, name: 'us-east-1', location: 'New York', status: 'online', servers: 12, memory: 67, cpu: 45 },
  { id: 2, name: 'us-west-2', location: 'Oregon', status: 'online', servers: 8, memory: 45, cpu: 32 },
  { id: 3, name: 'eu-west-1', location: 'Dublin', status: 'maintenance', servers: 6, memory: 89, cpu: 67 },
  { id: 4, name: 'eu-central-1', location: 'Frankfurt', status: 'online', servers: 15, memory: 56, cpu: 41 },
];

export const NodesPage: React.FC = () => {
  return (
    <div>
      <Header title="Nodes" description="Manage your server nodes" />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-[var(--muted-foreground)]">Total: {nodes.length} nodes</p>
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Node
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {nodes.map((node) => (
            <Card key={node.id} className="group hover:shadow-card-hover transition-all duration-200">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${node.status === 'online' ? 'bg-[var(--theme-primary)]/10' : 'bg-amber-100'}`}>
                    <HardDrive className={`h-5 w-5 ${node.status === 'online' ? 'text-[var(--theme-primary)]' : 'text-amber-600'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{node.name}</CardTitle>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{node.location}</p>
                  </div>
                </div>
                <Badge variant={node.status === 'online' ? 'success' : 'warning'}>
                  {node.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--muted-foreground)]">Servers</span>
                    <span className="font-semibold text-[var(--foreground)]">{node.servers}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[var(--muted-foreground)]">Memory</span>
                      <span className="font-semibold text-[var(--foreground)]">{node.memory}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)]"
                        style={{ width: node.memory + '%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[var(--muted-foreground)]">CPU</span>
                      <span className="font-semibold text-[var(--foreground)]">{node.cpu}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)]"
                        style={{ width: node.cpu + '%' }}
                      />
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