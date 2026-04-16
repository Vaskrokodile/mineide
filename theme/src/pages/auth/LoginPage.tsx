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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-primary" />
          </div>
          <CardTitle className="text-2xl text-center">MineIDE</CardTitle>
          <CardDescription className="text-center">
            Enter your Pterodactyl API key to access the panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Key
              </label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key (identifier_token format)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from Pterodactyl Panel → API Credentials → Create New Key
            </p>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};