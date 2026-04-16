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
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-[var(--muted-foreground)]">Total: {locations.length} locations</p>
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Location
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <Card key={location.id} className="hover:border-[var(--theme-primary)]/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-[var(--secondary)] p-1.5">
                    <Globe className="h-4 w-4 text-[var(--foreground)]" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{location.name}</CardTitle>
                    <p className="text-[10px] text-[var(--muted-foreground)]">{location.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[var(--muted-foreground)]">
                    <Server className="h-3 w-3" />
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