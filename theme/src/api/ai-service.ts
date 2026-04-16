import type { AIConfig, ChatMessage, FileContext } from './ai';

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  updateConfig(config: AIConfig) {
    this.config = config;
  }

  async sendMessage(
    messages: ChatMessage[],
    fileContext?: FileContext[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(fileContext);
    const allMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    switch (this.config.provider) {
      case 'ollama':
        return this.sendToOllama(allMessages, onChunk);
      case 'anthropic':
        return this.sendToAnthropic(allMessages, onChunk);
      case 'gemini':
        return this.sendToGemini(allMessages, onChunk);
      case 'deepseek':
        return this.sendToDeepSeek(allMessages, onChunk);
      case 'kimi':
        return this.sendToKimi(allMessages, onChunk);
      case 'minimax':
        return this.sendToMiniMax(allMessages, onChunk);
      case 'zhipu':
        return this.sendToZhipu(allMessages, onChunk);
      case 'qwen':
        return this.sendToQwen(allMessages, onChunk);
      case 'groq':
        return this.sendToGroq(allMessages, onChunk);
      case 'together':
        return this.sendToTogether(allMessages, onChunk);
      case 'perplexity':
        return this.sendToPerplexity(allMessages, onChunk);
      case 'mistral':
        return this.sendToMistral(allMessages, onChunk);
      case 'fireworks':
        return this.sendToFireworks(allMessages, onChunk);
      default:
        return this.sendToOpenAI(allMessages, onChunk);
    }
  }

  private buildSystemPrompt(fileContext?: FileContext[]): string {
    let prompt = `You are an expert AI coding assistant. You can read, modify, and create files in the project.

You have access to the following files in the project:
`;

    if (fileContext && fileContext.length > 0) {
      for (const file of fileContext) {
        prompt += `\n\`\`\`${file.path}\n${file.content}\n\`\`\`\n`;
      }
    } else {
      prompt += `\nNo files currently loaded. Ask the user to select files for you to work with.\n`;
    }

    prompt += `
Important guidelines:
- Always follow the existing code style and conventions
- Make minimal, targeted changes when possible
- Explain what you're doing before making changes
- Use file paths relative to the project root
- When modifying files, clearly indicate the file path and changes
- You can create new files or modify existing ones
- Be concise and focused on the task at hand
- When providing code, always wrap it in markdown code blocks with the file path
`;

    return prompt;
  }

  private getBaseUrl(): string {
    if (this.config.baseUrl) {
      return this.config.baseUrl;
    }

    const baseUrls: Record<string, string> = {
      openai: 'https://api.openai.com/v1',
      anthropic: 'https://api.anthropic.com',
      gemini: 'https://generativelanguage.googleapis.com/v1beta',
      deepseek: 'https://api.deepseek.com',
      kimi: 'https://api.moonshot.cn/v1',
      minimax: 'https://api.minimax.chat/v',
      zhipu: 'https://open.bigmodel.cn/api/paas/v4',
      qwen: 'https://dashscope.aliyuncs.com/api/v1',
      groq: 'https://api.groq.com/openai/v1',
      together: 'https://api.together.xyz/v1',
      perplexity: 'https://api.perplexity.ai',
      mistral: 'https://api.mistral.ai/v1',
      fireworks: 'https://api.fireworks.ai/inference/v1',
    };

    return baseUrls[this.config.provider] || 'https://api.openai.com/v1';
  }

  private getAuthHeader(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    switch (this.config.provider) {
      case 'anthropic':
        headers['x-api-key'] = this.config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'kimi':
      case 'minimax':
      case 'zhipu':
      case 'qwen':
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        break;
      case 'gemini':
        headers['x-goog-api-key'] = this.config.apiKey;
        break;
      case 'perplexity':
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        break;
      default:
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  private async sendToOpenAI(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToAnthropic(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages.filter(m => m.role !== 'system');

    const body = {
      model: this.config.model,
      system: systemPrompt,
      messages: chatMessages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      max_tokens: 4096,
      stream: true,
    };

    return this.streamRequest(`${this.getBaseUrl()}/messages`, body, onChunk, 'anthropic');
  }

  private async sendToGemini(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] }));

    const systemInstruction = messages.find(m => m.role === 'system')?.content;

    const body = {
      contents,
      systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      generationConfig: { maxOutputTokens: 4096 },
    };

    return this.streamRequest(`${this.getBaseUrl()}/models/${this.config.model}:streamGenerateContent?alt=sse`, body, onChunk, 'gemini');
  }

  private async sendToDeepSeek(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToKimi(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToMiniMax(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/text/chatcompletion_v2`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToZhipu(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToQwen(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/services/aigc/text-generation/interface`, {
      model: this.config.model,
      input: { messages },
      parameters: { stream: true },
    }, onChunk, 'qwen');
  }

  private async sendToGroq(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToTogether(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToPerplexity(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToMistral(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToFireworks(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    return this.streamRequest(`${this.getBaseUrl()}/chat/completions`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'openai');
  }

  private async sendToOllama(
    messages: { role: string; content: string }[],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const baseUrl = this.config.baseUrl || 'http://localhost:11434';
    return this.streamRequest(`${baseUrl}/api/chat`, {
      model: this.config.model,
      messages,
      stream: true,
    }, onChunk, 'ollama');
  }

  private async streamRequest(
    url: string,
    body: any,
    onChunk?: (chunk: string) => void,
    format: 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'qwen' = 'openai'
  ): Promise<string> {
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error: ${response.status} - ${error}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    let fullContent = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (!line.trim() || line === 'event: done') continue;

        let content = '';
        let parsed: any = null;

        try {
          if (format === 'openai') {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              parsed = JSON.parse(data);
              content = parsed.choices?.[0]?.delta?.content || '';
            }
          } else if (format === 'anthropic') {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              parsed = JSON.parse(data);
              content = parsed.delta?.text || '';
            }
          } else if (format === 'ollama') {
            if (line) {
              parsed = JSON.parse(line);
              content = parsed.message?.content || '';
            }
          } else if (format === 'qwen') {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              parsed = JSON.parse(data);
              content = parsed.output?.choices?.[0]?.message?.content || parsed.output?.text || '';
            }
          } else if (format === 'gemini') {
            if (line.startsWith('[') || line.startsWith('{')) {
              parsed = JSON.parse(line);
              content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            }
          }

          if (content) {
            fullContent += content;
            onChunk?.(content);
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }

    return fullContent;
  }
}
