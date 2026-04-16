import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '@/api/http';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loader2, Key } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      setAuthToken(apiKey);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid API key');
      clearAuthToken();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthToken = () => {
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[var(--theme-primary)]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-[var(--theme-primary)]/10 blur-3xl" />
      </div>
      
      <Card className="relative w-full max-w-sm border-0 shadow-2xl shadow-[var(--theme-primary)]/10 animate-scale-in">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--theme-button-primary)] to-[var(--theme-button-secondary)] flex items-center justify-center shadow-lg shadow-[var(--theme-button-primary)]/30">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent">MineIDE</CardTitle>
          <CardDescription className="text-xs">
            Enter your Pterodactyl API key to access the panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="apiKey" className="text-xs font-medium text-[var(--foreground)] flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-[var(--theme-primary)]" />
                API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="ptlc_xxxxxxxxxxxxxxxx"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="h-9"
              />
            </div>
            <p className="text-[10px] text-[var(--muted-foreground)] text-center">
              Get your API key from Pterodactyl Panel → API Credentials
            </p>
            <Button type="submit" className="w-full h-9 text-sm font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect to Panel'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};