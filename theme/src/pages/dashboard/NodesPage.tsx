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
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Total: {nodes.length} nodes</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Node
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {nodes.map((node) => (
            <Card key={node.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{node.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{node.location}</p>
                  </div>
                </div>
                <Badge variant={node.status === 'online' ? 'success' : node.status === 'maintenance' ? 'warning' : 'destructive'}>
                  {node.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Servers</span>
                    <span className="font-medium">{node.servers}</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Memory</span>
                      <span className="font-medium">{node.memory}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div 
                        className={`h-1.5 rounded-full ${node.memory > 80 ? 'bg-red-500' : node.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${node.memory}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">CPU</span>
                      <span className="font-medium">{node.cpu}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div 
                        className={`h-1.5 rounded-full ${node.cpu > 80 ? 'bg-red-500' : node.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${node.cpu}%` }}
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