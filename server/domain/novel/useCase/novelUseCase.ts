import { load } from 'cheerio';
import iconv from 'iconv-lite';
import { OpenAI } from 'openai';
import { transaction } from 'service/prismaClient';

const openai = new OpenAI({
  apiKey: 'sk-proj-EejuKYIaCeY56Ae80H0jT3BlbkFJDI2mXisdasdadaasdadsa3mpeGPCA852aUy',
  // baseURL: 'https://api.openai.inidsasdadsadad.org/api/v1',
});

export const novelUseCase = {
  scrape: (aozoraUrl: string): Promise<string> =>
    transaction('RepeatableRead', async (tx) => {
      const buffer = await fetch(aozoraUrl).then((b) => b.arrayBuffer());
      const html = iconv.decode(Buffer.from(buffer), 'Shift_JIS');
      const $ = load(html);
      const body = $('.main_text').text();

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            {
              role: 'user',
              content: `Please summarize the following text: こんにちはさかもとそうやです。今日は学校でテストがありました。それとご飯を食べました`,
            },
          ],
          max_tokens: 100, // 必要なトークン数を制限
        });

        console.log('API Response:', response);

        const summary = response.choices?.[0]?.message?.content ?? '';
        return summary;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching summary:', error.message);
          return `Error summarizing text: ${error.message}`;
        } else {
          console.error('Unknown error fetching summary:', error);
          return 'Error summarizing text: An unknown error occurred.';
        }
      }
    }),
};
