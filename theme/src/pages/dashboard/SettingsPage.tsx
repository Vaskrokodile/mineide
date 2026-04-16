import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings as SettingsIcon, Database, Bell } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div>
      <Header title="Settings" description="Panel configuration" />
      <div className="p-6 space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic panel configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Panel Name</label>
              <Input defaultValue="My Pterodactyl Panel" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Language</label>
              <Input defaultValue="en" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email alerts for server events</p>
              </div>
              <Button variant="secondary">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Discord Integration</p>
                <p className="text-sm text-muted-foreground">Send alerts to Discord webhook</p>
              </div>
              <Button variant="ghost">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Database</CardTitle>
                <CardDescription>Database configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Host</label>
              <Input defaultValue="localhost" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Port</label>
                <Input defaultValue="3306" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Database</label>
                <Input defaultValue="pterodactyl" />
              </div>
            </div>
            <Button>Test Connection</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};