import { Route } from '@/types';
import cache from '@/utils/cache';
import got from '@/utils/got';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
import timezone from '@/utils/timezone';

const baseUrl = 'https://www.kimlaw.or.kr';

export const route: Route = {
    path: '/thesis',
    categories: ['study'],
    example: '/kimlaw/thesis',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    radar: [
        {
            source: ['kimlaw.or.kr/67', 'kimlaw.or.kr/'],
        },
    ],
    name: 'Thesis',
    maintainers: ['TonyRL'],
    handler,
    url: 'kimlaw.or.kr/67',
};

async function handler() {
    const link = `${baseUrl}/67`;
    const { data: response } = await got(link);

    const $ = load(response);
    const list = $('.li_body')
        .toArray()
        .map((item) => {
            item = $(item);
            const a = item.find('a.list_text_title');
            return {
                title: a.text(),
                link: `${baseUrl}${a.attr('href')}`,
                author: item.find('.name').text(),
                pubDate: timezone(parseDate(item.find('.time').attr('title')), 9),
            };
        });

    const items = await Promise.all(
        list.map((item) =>
            cache.tryGet(item.link, async () => {
                const { data: response } = await got(item.link);
                const $ = load(response);

                item.description = $('.board_txt_area').html();
                return item;
            })
        )
    );

    return {
        title: `${$('.widget_menu_title').text()} - ${$('head title').text()}`,
        link,
        image: 'https://cdn.imweb.me/upload/S20210819f9dd86d20e7d7/9aec17c4e98a5.ico',
        item: items,
    };
}
