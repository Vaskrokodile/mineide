import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { minecraftApi } from '@/api/minecraft';
import { ArrowLeft, ArrowRight, Check, Server, Cpu, Globe, Shield } from 'lucide-react';

const STEPS = [
  { id: 'basics', title: 'Basic Info', icon: Server },
  { id: 'server', title: 'Server Type', icon: Cpu },
  { id: 'gameplay', title: 'Gameplay', icon: Globe },
  { id: 'advanced', title: 'Advanced', icon: Shield },
];

export const CreateServer: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [versions, setVersions] = useState<any[]>([]);
  const [serverTypes, setServerTypes] = useState<any[]>([]);

  const [config, setConfig] = useState({
    name: '',
    version: '1.21.4',
    type: 'vanilla',
    port: 25565,
    maxPlayers: 20,
    difficulty: 'normal',
    pvp: true,
    whitelist: false,
    allowFlight: false,
    spawnAnimals: true,
    spawnMonsters: true,
    spawnNpcs: true,
    viewDistance: 10,
    seed: '',
    motd: 'A MineIDE Minecraft Server',
    onlineMode: true,
    ram: 2048,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [v, t] = await Promise.all([
        minecraftApi.getVersions(),
        minecraftApi.getServerTypes(),
      ]);
      setVersions(v);
      setServerTypes(t);
    };
    fetchData();
  }, []);

  const updateConfig = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const server = await minecraftApi.createServer(config);
      navigate(`/minecraft/console/${server.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Create Server" description="Set up your new Minecraft server" />
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs mt-1 hidden sm:block">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${i < step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{STEPS[step].title}</CardTitle>
            <CardDescription>
              {step === 0 && 'Enter the basic server information'}
              {step === 1 && 'Choose your server type and version'}
              {step === 2 && 'Configure gameplay settings'}
              {step === 3 && 'Configure advanced options'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Server Name</label>
                  <Input
                    value={config.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                    placeholder="My Awesome Server"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message of the Day (MOTD)</label>
                  <Input
                    value={config.motd}
                    onChange={(e) => updateConfig('motd', e.target.value)}
                    placeholder="Welcome to my server!"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Server Port</label>
                    <Input
                      type="number"
                      value={config.port}
                      onChange={(e) => updateConfig('port', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Players</label>
                    <Input
                      type="number"
                      value={config.maxPlayers}
                      onChange={(e) => updateConfig('maxPlayers', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Server Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {serverTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          config.type === type.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => updateConfig('type', type.id)}
                      >
                        <p className="font-medium">{type.name}</p>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minecraft Version</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={config.version}
                    onChange={(e) => updateConfig('version', e.target.value)}
                  >
                    {versions.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">RAM Allocation (MB)</label>
                  <Input
                    type="number"
                    value={config.ram}
                    onChange={(e) => updateConfig('ram', parseInt(e.target.value))}
                    min={512}
                    max={16384}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 2048MB for vanilla, 4096MB+ for modded
                  </p>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={config.difficulty}
                    onChange={(e) => updateConfig('difficulty', e.target.value)}
                  >
                    <option value="peaceful">Peaceful</option>
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">World Seed</label>
                  <Input
                    value={config.seed}
                    onChange={(e) => updateConfig('seed', e.target.value)}
                    placeholder="Leave empty for random"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Gameplay Options</label>
                  <div className="space-y-2">
                    {[
                      { key: 'pvp', label: 'PvP Enabled', desc: 'Players can damage each other' },
                      { key: 'whitelist', label: 'Whitelist', desc: 'Only whitelisted players can join' },
                      { key: 'allowFlight', label: 'Allow Flight', desc: 'Players can fly in survival (if enabled in客户端)' },
                      { key: 'spawnAnimals', label: 'Spawn Animals', desc: 'Animals will spawn naturally' },
                      { key: 'spawnMonsters', label: 'Spawn Monsters', desc: 'Monsters will spawn in darkness' },
                      { key: 'spawnNpcs', label: 'Spawn NPCs', desc: 'NPCs will appear in villages' },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent"
                      >
                        <div>
                          <p className="font-medium">{opt.label}</p>
                          <p className="text-sm text-muted-foreground">{opt.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={config[opt.key as keyof typeof config] as boolean}
                          onChange={(e) => updateConfig(opt.key, e.target.checked)}
                          className="h-4 w-4"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">View Distance</label>
                  <Input
                    type="number"
                    value={config.viewDistance}
                    onChange={(e) => updateConfig('viewDistance', parseInt(e.target.value))}
                    min={4}
                    max={32}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values show more terrain but use more RAM
                  </p>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent">
                    <div>
                      <p className="font-medium">Online Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Require players to have a legitimate Minecraft account
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.onlineMode}
                      onChange={(e) => updateConfig('onlineMode', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              {step > 0 ? (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => navigate('/minecraft')}>
                  Cancel
                </Button>
              )}

              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleCreate} disabled={loading || !config.name}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Create Server
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};