const got = require('@/utils/got');

module.exports = async (ctx) => {
    const response = await got({
        url: `https://zw.cdzjryb.com/cd_jcfw_gateway/hsweb/publicity/findRegistrationProjectPublicity`,
        headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9',
            'business-source': 'WEB',
            'cache-control': 'no-cache',
            'content-type': 'application/json;charset=UTF-8',
            'current-site': '510100',
            'hsweb-auth': '',
            'portal-auth': 'undefined',
            pragma: 'no-cache',
            'sec-ch-ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            // "x-eis-authorization": "",
            // "x-eis-down-org-id": "xxx",
            // "x-eis-request-hash": "xxx",
            // "x-eis-request-id": "xxx",
            // "x-eis-tenant-id": "chengdu",
            // "cookie": "JSESSIONID=xxx"
        },
        referrerPolicy: 'no-referrer',
        body: '{"dicHsipTypeCode":"GR"}',
        method: 'POST',
    });

    const items = response.data.data.list.map((item) => ({
        title: item.title,
        link: 'https://zw.cdzjryb.com/hsweb_portal/#/guaranteedRentalHousing/home?fileId=' + item.fileId,
        pubDate: Date.parse(item.publishTime),
    }));

    ctx.state.data = {
        title: '成都保障性租赁住房',
        link: `https://zw.cdzjryb.com/hsweb_portal/#/guaranteedRentalHousing/home`,
        item: items,
    };
};
