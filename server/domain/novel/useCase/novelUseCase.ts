import { load } from 'cheerio';
import iconv from 'iconv-lite';
import { transaction } from 'service/prismaClient';

export const novelUseCase = {
  scrape: (aozoraUrl: string): Promise<string> =>
    transaction('RepeatableRead', async (tx) => {
      const buffer = await fetch(aozoraUrl).then((b) => b.arrayBuffer());
      const html = iconv.decode(Buffer.from(buffer), 'Shift_JIS');
      const $ = load(html);
      const body = $('body').text();
      return body;
    }),
};
