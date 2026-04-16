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
    defaultModel: 'gpt-4o',
    models: [
      'chatgpt-4o-latest',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4.5-preview',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'o1',
      'o1-mini',
      'o1-pro',
      'o3',
      'o3-mini',
      'o3-mini-high',
      'o4-mini',
      'o4-mini-high',
    ],
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-sonnet-4-7-2025',
    models: [
      'claude-sonnet-4-7-2025',
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
      'gemini-2.0-flash-thinking',
      'gemini-2.0-flash-thinking-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b',
      'gemini-3.1-flash-preview',
      'gemini-3.1-pro-preview',
      'gemini-exp-preview',
    ],
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat-v3-0324',
    models: [
      'deepseek-chat-v3-0324',
      'deepseek-chat',
      'deepseek-reasoner-v2-20250514',
      'deepseek-reasoner',
      'deepseek-coder-v2-20250514',
      'deepseek-coder',
    ],
  },
  kimi: {
    name: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.cn/v1',
    defaultModel: 'k2.5-future',
    models: [
      'k2.5-future',
      'k2.5',
      'k2.5-native',
      'moonshot-v1-128k',
      'moonshot-v1-32k',
      'moonshot-v1-8k',
      'moonshot-v1-8k-preview',
      'moonshot-v1-32k-preview',
      'moonshot-v1-128k-preview',
      'kimi-core',
      'kimi-k2.5-dev',
    ],
  },
  minimax: {
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v',
    defaultModel: 'MiniMax-M4',
    models: [
      'MiniMax-M4',
      'MiniMax-M4.5',
      'MiniMax-M3',
      'MiniMax-M3.5',
      'MiniMax-M2.7',
      'MiniMax-M2',
      'MiniMax-Text-01',
      'abab6.5s',
      'abab6.5g',
      'abab6',
    ],
  },
  zhipu: {
    name: 'Zhipu (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    defaultModel: 'glm-5-0520',
    models: [
      'glm-5-0520',
      'glm-5',
      'glm-5-plus',
      'glm-4-plus',
      'glm-4',
      'glm-4v',
      'glm-4-air',
      'glm-4-airx',
      'glm-3-turbo',
      'glm-3',
      'glm-5.1',
      'glm-5.1-plus',
    ],
  },
  qwen: {
    name: 'Qwen (Alibaba)',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    defaultModel: 'qwen3.6-72b-instruct',
    models: [
      'qwen3.6-72b-instruct',
      'qwen3.6-32b-instruct',
      'qwen3.6-8b-instruct',
      'qwen3.1-72b-instruct',
      'qwen3.1-32b-instruct',
      'qwen3.1-8b-instruct',
      'qwen3-72b-instruct',
      'qwen3-32b-instruct',
      'qwen3-8b-instruct',
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
      'qwen2.5-math',
    ],
  },
  groq: {
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
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
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    models: [
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'meta-llama/Llama-3.1-405B-Instruct-Turbo',
      'meta-llama/Llama-3.1-70B-Instruct-Turbo',
      'meta-llama/Llama-3.1-8B-Instruct-Turbo',
      'deepseek-ai/DeepSeek-V3',
      'deepseek-ai/DeepSeek-R1',
      'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
      'deepseek-ai/DeepSeek-R1-Distill-Llama-70B',
      'Qwen/Qwen2.5-72B-Instruct',
      'Qwen/Qwen2.5-32B-Instruct',
      'mistralai/Mixtral-8x7B-Instruct-v0.1',
      'mistralai/Mistral-7B-Instruct-v0.3',
      'codellama/CodeLlama-70b-Python',
      'nvidia/Llama-3.1-Nemotron-70B-Instruct',
      'google/gemma-2-27b-it',
      'google/gemma-2-9b-it',
    ],
  },
  perplexity: {
    name: 'Perplexity',
    baseUrl: 'https://api.perplexity.ai',
    defaultModel: 'sonar',
    models: [
      'sonar',
      'sonar-pro',
      'sonar-reasoning',
      'sonar-reasoning-pro',
      'sonar-online',
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-huge-128k-online',
      'llama-3.1-sonar-large-128k-chat',
      'llama-3.1-sonar-small-128k-chat',
    ],
  },
  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-large-3',
    models: [
      'mistral-large-3',
      'mistral-large-2',
      'mistral-medium-3.1',
      'mistral-medium-3',
      'mistral-small-4',
      'mistral-small-3.2',
      'mistral-small-3.1',
      'mistral-nemo-12b',
      'mistral-nemo',
      'mistral-7b-instruct',
      'open-mixtral-8x7b',
      'open-mixtral-8x22b',
      'codestral',
      'codestral-latest',
      'devstral-2',
      'devstral',
      'mistral-ocr-latest',
      'ministral-3-14b',
      'ministral-3-8b',
      'ministral-3-3b',
      'magistral-medium-1.2',
      'magistral-small-1.2',
      'voxtral-tts',
      'voxtral-mini-transcribe-2',
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
      'accounts/fireworks/models/deepseek-r1-70b',
      'accounts/fireworks/models/deepseek-r1-32b',
      'accounts/fireworks/models/deepseek-r1-8b',
      'accounts/fireworks/models/firefunction-v2',
      'accounts/fireworks/models/firefunction-v1',
      'accounts/fireworks/models/phi-4',
      'accounts/fireworks/models/phi-3.5-mini-instruct',
      'accounts/fireworks/models/llama-v3.3-70b-instruct',
      'accounts/fireworks/models/gemma-3-27b-it',
      'accounts/fireworks/models/gemma-3-12b-it',
      'accounts/fireworks/models/devstral-2',
      'accounts/fireworks/models/codestral',
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
      'mistral-nemo',
      'mixtral',
      'mixtral:8x22b',
      'phi4',
      'phi3',
      'qwen2.5',
      'qwen2.5-coder',
      'qwen2.5-math',
      'qwen3',
      'qwen3:72b',
      'qwen3:32b',
      'deepseek-r1',
      'deepseek-r1:70b',
      'deepseek-r1:32b',
      'deepseek-r1:14b',
      'deepseek-r1:8b',
      'deepseek-coder-v2',
      'deepseek-v3',
      'gemma3',
      'gemma3:27b',
      'gemma3:12b',
      'gemma2',
      'gemma2:27b',
      'llava',
      'llava-llama3',
      'bakllava',
      'wizardlm2',
      'wizardlm2:70b',
      'wizardcoder2',
      'NousHermes',
      'openhermes',
      'orca-mini',
      'vicuna',
      'command-r',
      'command-r-plus',
      'command-r7b',
      'dbrx',
      'starcoder2',
      'starcoder2:15b',
      'snowflake-arctic-instruct',
      'mistral-large-3',
      'mistral-medium-3',
      'mistral-small-3',
      'devstral',
      'codestral',
      'magistral-small-1',
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
