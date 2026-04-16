import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Globe, Server } from 'lucide-react';

const locations = [
  { id: 1, name: 'US East', description: 'New York datacenter', nodes: 3, servers: 45 },
  { id: 2, name: 'US West', description: 'Oregon datacenter', nodes: 2, servers: 28 },
  { id: 3, name: 'EU West', description: 'Dublin datacenter', nodes: 2, servers: 32 },
  { id: 4, name: 'EU Central', description: 'Frankfurt datacenter', nodes: 4, servers: 67 },
];

export const LocationsPage: React.FC = () => {
  return (
    <div>
      <Header title="Locations" description="Manage server locations" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">Total: {locations.length} locations</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <Card key={location.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent p-2">
                    <Globe className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{location.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{location.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Server className="h-4 w-4" />
                    <span>{location.servers} servers</span>
                  </div>
                  <Badge variant="secondary">{location.nodes} nodes</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};