import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Server, Users, HardDrive, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { label: 'Total Servers', value: '24', icon: Server, change: '+2 this week', trend: 'up' },
  { label: 'Active Users', value: '156', icon: Users, change: '+12 this month', trend: 'up' },
  { label: 'Nodes Online', value: '8', icon: HardDrive, change: 'All healthy', trend: 'neutral' },
  { label: 'API Requests', value: '12.4k', icon: Activity, change: '+5.2% this week', trend: 'up' },
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
      <Header title="Dashboard" description="Welcome back! Here's what's happening." />
      <div className="p-5 space-y-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="group hover:shadow-card-hover transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-[var(--muted-foreground)]">{stat.label}</CardTitle>
                <div className="h-8 w-8 rounded-lg bg-[var(--theme-primary)]/10 flex items-center justify-center group-hover:bg-[var(--theme-primary)]/20 transition-colors">
                  <stat.icon className="h-4 w-4 text-[var(--theme-primary)]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-[var(--theme-primary)]" />}
                      {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                      <p className={`text-[10px] font-medium ${stat.trend === 'up' ? 'text-[var(--theme-primary)]' : stat.trend === 'down' ? 'text-red-600' : 'text-[var(--muted-foreground)]'}`}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="group hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Servers</CardTitle>
                <span className="text-[10px] font-medium text-[var(--theme-primary)] bg-[var(--theme-primary)]/10 px-1.5 py-0.5 rounded-md">View all</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentServers.map((server) => (
                  <div
                    key={server.name}
                    className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:border-[var(--theme-primary)]/30 hover:bg-[var(--theme-primary)]/5 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2 w-2 rounded-full ${server.status === 'online' ? 'bg-[var(--theme-primary)] shadow-sm shadow-[var(--theme-primary)]/50' : 'bg-[var(--muted-foreground)]'}`} />
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{server.name}</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">{server.node}</p>
                      </div>
                    </div>
                    {server.status === 'online' && (
                      <div className="text-right">
                        <p className="text-xs font-semibold text-[var(--theme-primary)]">{server.usage}%</p>
                        <p className="text-[10px] text-[var(--muted-foreground)]">CPU</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-card-hover transition-all duration-200">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'CPU Usage', value: 42 },
                  { label: 'Memory Usage', value: 68 },
                  { label: 'Disk Usage', value: 34 },
                ].map((metric) => (
                  <div key={metric.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[var(--foreground)]">{metric.label}</span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">{metric.value}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] transition-all duration-300"
                        style={{ width: metric.value + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};