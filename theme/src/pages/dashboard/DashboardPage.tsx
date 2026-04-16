import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Server, Users, HardDrive, Activity } from 'lucide-react';

const stats = [
  { label: 'Total Servers', value: '24', icon: Server, change: '+2 this week' },
  { label: 'Active Users', value: '156', icon: Users, change: '+12 this month' },
  { label: 'Nodes Online', value: '8', icon: HardDrive, change: 'All healthy' },
  { label: 'API Requests', value: '12.4k', icon: Activity, change: '+5.2% from last week' },
];

const recentServers = [
  { name: 'mc-hypixel-1', status: 'online', node: 'us-east-1', usage: 67 },
  { name: 'valheim-world-3', status: 'online', node: 'eu-west-1', usage: 45 },
  { name: 'css-rank-2', status: 'offline', node: 'us-west-2', usage: 0 },
  { name: 'gta-five-moderated', status: 'online', node: 'us-east-1', usage: 82 },
];

export const DashboardPage: React.FC = () => {
  return (
    <div>
      <Header title="Dashboard" description="Overview of your panel" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Servers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentServers.map((server) => (
                  <div
                    key={server.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          server.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{server.name}</p>
                        <p className="text-sm text-muted-foreground">{server.node}</p>
                      </div>
                    </div>
                    {server.status === 'online' && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{server.usage}%</p>
                        <p className="text-xs text-muted-foreground">CPU</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-[42%] rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-[68%] rounded-full bg-yellow-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disk Usage</span>
                  <span className="text-sm font-medium">34%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-[34%] rounded-full bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};