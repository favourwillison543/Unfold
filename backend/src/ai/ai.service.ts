import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private readonly groq: Groq;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>(
        'GROQ_API_KEY',
      ),
    });
  }

  async generateJson(
    messages: {
      role: 'system' | 'user';
      content: string;
    }[],
  ) {
    const response =
      await this.groq.chat.completions.create(
        {
          model: 'openai/gpt-oss-120b',
          messages,
          response_format: {
            type: 'json_object',
          },
          max_completion_tokens: 3000,
        },
        {
          timeout: 30_000,
        },
      );

    const content =
      response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('AI returned no response');
    }

    return JSON.parse(content);
  }
}