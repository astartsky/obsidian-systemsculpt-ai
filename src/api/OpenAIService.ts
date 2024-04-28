import { requestUrl } from 'obsidian';
import https from 'https';
import { Model } from './Model';

export class OpenAIService {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey: string, apiEndpoint: string) {
    this.apiKey = apiKey;
    this.apiEndpoint = apiEndpoint;
  }

  updateApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async createChatCompletion(
    systemPrompt: string,
    userMessage: string,
    modelId: string,
    maxTokens: number
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    const requestData = JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
    });

    const response = await fetch(`${this.apiEndpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: requestData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  async createStreamingChatCompletionWithCallback(
    systemPrompt: string,
    userMessage: string,
    modelId: string,
    maxTokens: number,
    callback: (chunk: string) => void,
    abortSignal?: AbortSignal
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key is not set');
    }

    const requestData = JSON.stringify({
      model: modelId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      stream: true,
      max_tokens: maxTokens,
    });

    const req = https.request(
      `${this.apiEndpoint}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
      res => this.handleResponse(res, callback)
    );

    req.on('error', error => {
      console.error('OpenAI request error:', error);
    });

    req.write(requestData);
    req.end();
  }

  private handleResponse(res: any, callback: (chunk: string) => void): void {
    let firstPartialChunk = '';
    let secondPartialChunk = '';
    let accumulatedResponse = '';
    res.on('data', chunk => {
      const decodedChunk = new TextDecoder('utf-8').decode(chunk);
      const chunks = decodedChunk.split('\n');
      chunks.forEach(chunk => {
        if (chunk.startsWith('data: ') && chunk.endsWith('null}]}')) {
          callback(chunk);
        } else if (chunk.startsWith('data: ')) {
          firstPartialChunk = chunk;
        } else {
          secondPartialChunk = chunk;
          callback(firstPartialChunk + secondPartialChunk);
        }
      });
    });
  }

  async getModels(): Promise<Model[]> {
    if (!this.apiKey) return [];

    try {
      const response = await requestUrl({
        url: `https://api.openai.com/v1/models`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      if (response.status === 200) {
        const data = response.json;
        return data.data
          .filter(
            (model: any) =>
              model.id === 'gpt-3.5-turbo' || model.id === 'gpt-4-turbo'
          )
          .map((model: any) => ({
            id: model.id,
            name: model.id,
            isLocal: false,
            provider: 'openai',
          }));
      } else {
        console.error('Failed to fetch OpenAI models:', response.status);
        return [];
      }
    } catch (error) {
      console.error('Error fetching OpenAI models:', error);
      return [];
    }
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey) return false;

    try {
      const response = await requestUrl({
        url: `https://api.openai.com/v1/models`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error('Error validating OpenAI API key:', error);
      return false;
    }
  }
}
