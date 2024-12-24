const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const response = await got.get(`https://gyk-notes.github.io`);
    const data = response.data;
    const $ = cheerio.load(data);

    const app_name = $('#logo').find('a').text().trim();

    const items = [];
    $('#content')
        .find('li')
        .each(function () {
            const item = {};
            item.title = $(this).find('a').text();
            item.pubDate = new Date($(this).text().split('- ')[1]).toUTCString();
            item.link = $(this).find('a').attr('href');

            items.push(item);
        });

    ctx.state.data = {
        title: app_name,
        link: `https://gyk-notes.github.io`,
        item: items,
    };
};
