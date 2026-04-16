export interface AIConfig {
  provider: 'openai' | 'anthropic' | 'gemini' | 'ollama';
  apiKey: string;
  baseUrl?: string;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface FileContext {
  path: string;
  content: string;
  language?: string;
}

export const defaultAIConfig: AIConfig = {
  provider: 'openai',
  apiKey: '',
  baseUrl: '',
  model: 'gpt-4o',
};

export const modelOptions: Record<string, { name: string; models: string[] }> = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  },
  gemini: {
    name: 'Google Gemini',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
  },
  ollama: {
    name: 'Ollama (Local)',
    models: ['llama3.2', 'codellama', 'mistral', 'mixtral'],
  },
};

export const saveAIConfig = (config: AIConfig) => {
  localStorage.setItem('aiConfig', JSON.stringify(config));
};

export const loadAIConfig = (): AIConfig => {
  const saved = localStorage.getItem('aiConfig');
  return saved ? JSON.parse(saved) : defaultAIConfig;
};
