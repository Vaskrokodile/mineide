import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings as SettingsIcon, Database, Bell, Palette, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import type { BackgroundTheme } from '@/context/ThemeContext';

const backgrounds: { id: BackgroundTheme; name: string; gradient: string }[] = [
  { id: 'white', name: 'White', gradient: 'bg-white' },
  { id: 'black', name: 'Midnight', gradient: 'bg-gradient-to-br from-[#0f0f23] to-[#1a1a2e]' },
  { id: 'navy', name: 'Ocean', gradient: 'bg-gradient-to-br from-[#0c1929] to-[#1e3a5f]' },
  { id: 'lunar', name: 'Lunar', gradient: 'bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44]' },
];

export const SettingsPage: React.FC = () => {
  const { config, setBackground, setCustomColors, setButtonColors, resetTheme, presets } = useTheme();

  return (
    <div>
      <Header title="Settings" description="Panel configuration" />
      <div className="p-5 space-y-4 max-w-2xl">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-md bg-[var(--theme-primary)]/10 p-1.5">
                  <Palette className="h-4 w-4 text-[var(--theme-primary)]" />
                </div>
                <div>
                  <CardTitle>Theme Customization</CardTitle>
                  <CardDescription>Customize the look of your panel</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={resetTheme}>
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-2 block">Background</label>
              <div className="grid grid-cols-4 gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackground(bg.id)}
                    className={`relative h-10 rounded-md border-2 transition-all overflow-hidden ${config.background === bg.id ? 'border-[var(--theme-primary)] ring-1 ring-[var(--theme-primary)]/20' : 'border-transparent hover:border-[var(--border)]'}`}
                  >
                    <div className={`absolute inset-0 ${bg.gradient}`} />
                    <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[9px] font-medium text-center bg-black/50 text-white rounded px-0.5 py-0.5">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-2 block">Preset Themes</label>
              <div className="grid grid-cols-3 gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setBackground(preset.background);
                      setCustomColors(preset.primary, preset.secondary);
                      setButtonColors(preset.buttonPrimary, preset.buttonSecondary);
                    }}
                    className={`p-2 rounded-md border transition-all text-left ${config.customPrimary === preset.primary ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/5' : 'border-[var(--border)] hover:border-[var(--theme-primary)]/50'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: preset.primary }} />
                      <span className="text-xs font-medium text-[var(--foreground)]">{preset.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      <div className="w-4 h-2 rounded-sm" style={{ background: preset.buttonPrimary }} />
                      <div className="w-4 h-2 rounded-sm" style={{ background: preset.buttonSecondary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block">Primary Color</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={config.customPrimary}
                    onChange={(e) => setCustomColors(e.target.value, config.customSecondary)}
                    className="w-7 h-7 rounded-md border cursor-pointer"
                  />
                  <Input
                    value={config.customPrimary}
                    onChange={(e) => setCustomColors(e.target.value, config.customSecondary)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block">Secondary Color</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={config.customSecondary}
                    onChange={(e) => setCustomColors(config.customPrimary, e.target.value)}
                    className="w-7 h-7 rounded-md border cursor-pointer"
                  />
                  <Input
                    value={config.customSecondary}
                    onChange={(e) => setCustomColors(config.customPrimary, e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block">Button Primary</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={config.buttonPrimary}
                    onChange={(e) => setButtonColors(e.target.value, config.buttonSecondary)}
                    className="w-7 h-7 rounded-md border cursor-pointer"
                  />
                  <Input
                    value={config.buttonPrimary}
                    onChange={(e) => setButtonColors(e.target.value, config.buttonSecondary)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block">Button Secondary</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={config.buttonSecondary}
                    onChange={(e) => setButtonColors(config.buttonPrimary, e.target.value)}
                    className="w-7 h-7 rounded-md border cursor-pointer"
                  />
                  <Input
                    value={config.buttonSecondary}
                    onChange={(e) => setButtonColors(config.buttonPrimary, e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="rounded-md bg-[var(--theme-primary)]/10 p-1.5">
                <SettingsIcon className="h-4 w-4 text-[var(--theme-primary)]" />
              </div>
              <div>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic panel configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Panel Name</label>
              <Input defaultValue="My Pterodactyl Panel" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Default Language</label>
              <Input defaultValue="en" />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="rounded-md bg-[var(--theme-primary)]/10 p-1.5">
                <Bell className="h-4 w-4 text-[var(--theme-primary)]" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Email Notifications</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Receive email alerts for server events</p>
              </div>
              <Button variant="secondary" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Discord Integration</p>
                <p className="text-[10px] text-[var(--muted-foreground)]">Send alerts to Discord webhook</p>
              </div>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="rounded-md bg-[var(--theme-primary)]/10 p-1.5">
                <Database className="h-4 w-4 text-[var(--theme-primary)]" />
              </div>
              <div>
                <CardTitle>Database</CardTitle>
                <CardDescription>Database configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Host</label>
              <Input defaultValue="localhost" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Port</label>
                <Input defaultValue="3306" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Database</label>
                <Input defaultValue="pterodactyl" />
              </div>
            </div>
            <Button size="sm">Test Connection</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};