const got = require('@/utils/got');
const cheerio = require('cheerio');
const url = require('url');

const host = 'https://weiwangqiang.github.io';

module.exports = async (ctx) => {
    const link = host + '/index.html';

    const response = await got({
        method: 'get',
        url: link,
    });
    const $ = cheerio.load(response.data);

    // 提取列表项
    const urlList = $('.post-preview')
        .find('a')
        // .slice(0, 10)
        .map((i, e) => $(e).attr('href'))
        .get();

    const out = await Promise.all(
        urlList.map(async (itemUrl) => {
            itemUrl = url.resolve(host, itemUrl);

            // 这里是使用 RSSHub 的缓存机制
            const cache = await ctx.cache.get(itemUrl);
            if (cache) {
                return Promise.resolve(JSON.parse(cache));
            }

            // 获取列表项中的网页内容，也就是一篇文章
            const response = await got.get(itemUrl);
            const $ = cheerio.load(response.data);

            // 标题、链接、内容、时间
            const single = {
                title: $('div.post-heading h1').text(),
                link: itemUrl,
                description: $('div.post-container')
                    .html()
                    .replace(/src="\//g, `src="${url.resolve(host, '.')}`)
                    .replace(/href="\//g, `href="${url.resolve(host, '.')}`)
                    .trim(),
                pubDate: new Date(itemUrl.match(/[1-9][0-9]{3}\/[0-9]{2}\/[0-9]{2}/)).toUTCString(),
            };

            ctx.cache.set(itemUrl, JSON.stringify(single), 24 * 60 * 60);

            return Promise.resolve(single);
        })
    );

    ctx.state.data = {
        title: 'Weiwq Blog',
        link,
        description: '个人博客',
        item: out,
    };
};
