export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'deepseek' | 'kimi' | 'minimax' | 'zhipu' | 'qwen' | 'groq' | 'together' | 'perplexity' | 'mistral' | 'fireworks';

export interface AIConfig {
  provider: AIProvider;
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

export interface ProviderInfo {
  name: string;
  baseUrl?: string;
  defaultModel: string;
  models: string[];
}

export const providerConfigs: Record<AIProvider, ProviderInfo> = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'chatgpt-4o-latest',
    models: [
      'chatgpt-4o-latest',
      'chatgpt-4o-mini-latest',
      'gpt-4.5-preview',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'o1-preview',
      'o1-mini',
      'o3-mini',
      'o3-mini-high',
      'o1',
      'o3',
      'o3-high',
    ],
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-sonnet-4-20250514',
    models: [
      'claude-sonnet-4-20250514',
      'claude-3-5-sonnet-20241022',
      'claude-3-5-sonnet-20240620',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-haiku-20240307',
    ],
  },
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-2.5-pro-preview',
    models: [
      'gemini-2.5-pro-preview',
      'gemini-2.5-flash-preview',
      'gemini-2.0-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-exp-1206',
      'gemini-2.0-flash-thinking',
    ],
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    models: [
      'deepseek-chat-v3-0324',
      'deepseek-chat',
      'deepseek-reasoner-v2',
      'deepseek-reasoner',
      'deepseek-coder-v2',
      'deepseek-coder',
    ],
  },
  kimi: {
    name: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'moonshot-v1-128k',
    models: [
      'moonshot-v1-128k',
      'moonshot-v1-32k',
      'moonshot-v1-8k',
      'moonshot-v1-8k-preview',
      'moonshot-v1-32k-preview',
      'moonshot-v1-128k-preview',
      'kimi-core',
    ],
  },
  minimax: {
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v',
    defaultModel: 'MiniMax-M4',
    models: [
      'MiniMax-M4',
      'MiniMax-M3',
      'MiniMax-M3.5',
      'MiniMax-M2.7',
      'MiniMax-M2',
      'MiniMax-Text-01',
      'abab6.5s',
      'abab6.5g',
      'abab6',
      'abab5.5s',
      'abab5.5g',
      'abab5.5',
    ],
  },
  zhipu: {
    name: 'Zhipu (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-5',
    models: [
      'glm-5',
      'glm-5-plus',
      'glm-4-plus',
      'glm-4',
      'glm-4v',
      'glm-4-air',
      'glm-4-airx',
      'glm-3-turbo',
    ],
  },
  qwen: {
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    defaultModel: 'qwen-max',
    models: [
      'qwen-max',
      'qwen-plus',
      'qwen-turbo',
      'qwen-max-longcontext',
      'qwen-coder-turbo',
      'qwen-coder-plus',
      'qwq-32b',
      'qwen2.5-72b-instruct',
      'qwen2.5-coder-32b-instruct',
      'qwen2.5-7b-instruct',
      'qwen2.5-1.5b-instruct',
      'qwen2.5-3b-instruct',
      'qwen2.5-0.5b-instruct',
      'qwen2.5-math',
      'qwen2.5-72b-instruct-AWQ',
    ],
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.1-70b-versatile',
    models: [
      'llama-3.3-70b-versatile',
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama-3.2-90b-vision-preview',
      'llama-3.2-11b-vision-preview',
      'llama-3.2-3b-preview',
      'llama-3.2-1b-preview',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'gemma2-2b-it',
    ],
  },
  together: {
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'meta-llama/Llama-3.1-8B-Instruct-Turbo-Free',
      'meta-llama/Llama-3.1-70B-Instruct-Turbo',
      'meta-llama/Llama-3.1-405B-Instruct-Turbo-Free',
      'deepseek-ai/DeepSeek-V3',
      'deepseek-ai/DeepSeek-R1',
      'Qwen/Qwen2.5-72B-Instruct',
      'Qwen/Qwen2.5-32B-Instruct',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.3',
      'codellama/CodeLlama-70b-Python',
      'nvidia/Llama-3.1-Nemotron-70B-Instruct',
    ],
  },
  perplexity: {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    defaultModel: 'llama-3.1-sonar-large-128k-online',
    models: [
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-huge-128k-online',
      'llama-3.1-sonar-large-128k-chat',
      'llama-3.1-sonar-small-128k-chat',
      'sonar',
      'sonar-pro',
      'sonar-reasoning',
      'sonar-reasoning-pro',
    ],
  },
  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-latest',
    models: [
      'mistral-large-latest',
      'mistral-large-2',
      'mistral-small-latest',
      'mistral-nemo',
      'mistral-7b-instruct',
      'open-mixtral-8x7b',
      'open-mixtral-8x22b',
      'codestral',
      'codestral-latest',
      'mistral-ocr-latest',
    ],
  },
  fireworks: {
    name: 'Fireworks AI',
    baseUrl: 'https://api.fireworks.ai/inference/v1',
    defaultModel: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
    models: [
      'accounts/fireworks/models/llama-v3p3-70b-instruct',
      'accounts/fireworks/models/llama-v3p1-405b-instruct',
      'accounts/fireworks/models/llama-v3p1-70b-instruct',
      'accounts/fireworks/models/llama-v3p1-8b-instruct',
      'accounts/fireworks/models/qwen2p5-72b-instruct',
      'accounts/fireworks/models/qwen2p5-32b-instruct',
      'accounts/fireworks/models/deepseek-v3',
      'accounts/fireworks/models/deepseek-r1',
      'accounts/fireworks/models/firefunction-v2',
      'accounts/fireworks/models/firefunction-v1',
      'accounts/fireworks/models/phi-4',
      'accounts/fireworks/models/phi-3.5-mini-instruct',
    ],
  },
  ollama: {
    name: 'Ollama (Local)',
    defaultModel: 'llama3.3',
    models: [
      'llama3.3',
      'llama3.2',
      'llama3.2-vision',
      'llama3.1',
      'llama3',
      'llama2',
      'codellama',
      'codellama:70b',
      'mistral',
      'mixtral',
      'phi4',
      'phi3',
      'qwen2.5',
      'qwen2.5-coder',
      'qwen2.5-math',
      'deepseek-r1',
      'deepseek-r1:70b',
      'deepseek-r1:32b',
      'deepseek-r1:14b',
      'deepseek-r1:8b',
      'gemma3',
      'gemma3:27b',
      'gemma2',
      'gemma2:27b',
      'llava',
      'llava-llama3',
      'bakllava',
      'mistral-nemo',
      'wizardlm2',
      'wizardlm2:70b',
      ' NousHermes',
      'openhermes',
      'orca-mini',
      'vicuna',
      'Command-r',
      'Command-r-plus',
      'dbrx',
      'starcoder2',
      'starcoder2:15b',
      'snowflake-arctic-instruct',
    ],
  },
};

export const defaultAIConfig: AIConfig = {
  provider: 'openai',
  apiKey: '',
  baseUrl: '',
  model: providerConfigs.openai.defaultModel,
};

export const saveAIConfig = (config: AIConfig) => {
  localStorage.setItem('aiConfig', JSON.stringify(config));
};

export const loadAIConfig = (): AIConfig => {
  const saved = localStorage.getItem('aiConfig');
  if (saved) {
    const parsed = JSON.parse(saved);
    if (parsed.provider && providerConfigs[parsed.provider as AIProvider]) {
      const provider = providerConfigs[parsed.provider as AIProvider];
      if (!provider.models.includes(parsed.model)) {
        parsed.model = provider.defaultModel;
      }
    }
    return parsed;
  }
  return defaultAIConfig;
};

export const getProviderModels = (provider: AIProvider): string[] => {
  return providerConfigs[provider]?.models || [];
};

export const getProviderDefaultModel = (provider: AIProvider): string => {
  return providerConfigs[provider]?.defaultModel || '';
};

export const getProviderBaseUrl = (provider: AIProvider): string | undefined => {
  return providerConfigs[provider]?.baseUrl;
};
