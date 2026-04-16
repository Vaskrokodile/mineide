import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { AIChatbox } from '@/components/ai/AIChatbox';
import { FileExplorer } from '@/components/ai/FileExplorer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AIService } from '@/api/ai-service';
import type { AIConfig, FileContext } from '@/api/ai';
import { loadAIConfig, saveAIConfig, modelOptions, defaultAIConfig } from '@/api/ai';
import { Bot, Settings, X, Loader2 } from 'lucide-react';

export const AIPage: React.FC = () => {
  const [config, setConfig] = useState<AIConfig>(defaultAIConfig);
  const [aiService, setAiService] = useState<AIService | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [fileContext, setFileContext] = useState<FileContext[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  useEffect(() => {
    const savedConfig = loadAIConfig();
    setConfig(savedConfig);
    if (savedConfig.apiKey) {
      initializeService(savedConfig);
    }
  }, []);

  const initializeService = (cfg: AIConfig) => {
    const service = new AIService(cfg);
    setAiService(service);
    setIsConnected(true);
  };

  const handleConfigChange = (key: keyof AIConfig, value: string) => {
    const newConfig = { ...config, [key]: value };
    if (key === 'provider') {
      newConfig.model = modelOptions[value].models[0];
    }
    setConfig(newConfig);
  };

  const handleSaveConfig = () => {
    saveAIConfig(config);
    initializeService(config);
    setShowSettings(false);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const service = new AIService(config);
      await service.sendMessage([
        { id: '1', role: 'user', content: 'Hi', timestamp: Date.now() }
      ], [], () => {});
      setTestStatus('success');
      setTimeout(() => setTestStatus('idle'), 2000);
    } catch (error) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  const handleFileSelect = useCallback((files: FileContext[]) => {
    setFileContext(files);
    setShowFileExplorer(false);
  }, []);

  const handleClearContext = () => {
    setFileContext([]);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      <Header title="AI Assistant" description="Coding assistant powered by AI" />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          {!isConnected && !showSettings ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="w-full max-w-md mx-4">
                <div className="p-6 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-[var(--theme-primary)]" />
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Connect AI Assistant</h2>
                  <p className="text-xs text-[var(--muted-foreground)] mb-4">
                    Configure your AI provider to start coding with AI assistance
                  </p>
                  <Button onClick={() => setShowSettings(true)}>
                    Configure AI
                  </Button>
                </div>
              </Card>
            </div>
          ) : showSettings ? (
            <div className="flex-1 overflow-y-auto p-5">
              <Card className="max-w-xl mx-auto">
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-[var(--theme-primary)]" />
                    <h2 className="text-sm font-semibold">AI Configuration</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)} className="h-7 w-7">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Provider</label>
                    <select
                      value={config.provider}
                      onChange={e => handleConfigChange('provider', e.target.value)}
                      className="w-full h-8 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 text-xs"
                    >
                      {Object.entries(modelOptions).map(([key, val]) => (
                        <option key={key} value={key}>{val.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Model</label>
                    <select
                      value={config.model}
                      onChange={e => handleConfigChange('model', e.target.value)}
                      className="w-full h-8 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 text-xs"
                    >
                      {modelOptions[config.provider]?.models.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block">API Key</label>
                    <Input
                      type="password"
                      value={config.apiKey}
                      onChange={e => handleConfigChange('apiKey', e.target.value)}
                      placeholder="sk-..."
                      className="h-9"
                    />
                  </div>

                  {(config.provider === 'ollama' || config.provider === 'gemini') && (
                    <div>
                      <label className="text-xs font-medium mb-1.5 block">
                        {config.provider === 'gemini' ? 'API Key' : 'Base URL'}
                      </label>
                      <Input
                        type={config.provider === 'gemini' ? 'password' : 'text'}
                        value={config.baseUrl || ''}
                        onChange={e => handleConfigChange('baseUrl', e.target.value)}
                        placeholder={config.provider === 'gemini' ? 'AIza...' : 'http://localhost:11434'}
                        className="h-9"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={!config.apiKey || testStatus === 'testing'}
                    >
                      {testStatus === 'testing' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      ) : null}
                      Test Connection
                    </Button>
                    {testStatus === 'success' && (
                      <span className="text-xs text-green-500">Connected!</span>
                    )}
                    {testStatus === 'error' && (
                      <span className="text-xs text-red-500">Connection failed</span>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" size="sm" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveConfig}>
                      Save & Connect
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <AIChatbox
                aiService={aiService}
                fileContext={fileContext}
                onFileSelect={() => setShowFileExplorer(true)}
                onClearContext={handleClearContext}
              />
            </div>
          )}
        </div>

        {showFileExplorer && (
          <div className="w-72 border-l border-[var(--border)] bg-[var(--card)]">
            <FileExplorer
              onSelectFiles={handleFileSelect}
              onClose={() => setShowFileExplorer(false)}
              selectedFiles={fileContext}
            />
          </div>
        )}
      </div>
    </div>
  );
};
