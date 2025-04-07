// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from 'crawlee';

const baseUrl = 'https://booknode.com/le_seigneur_des_anneaux_tome_1_la_communaute_de_lanneau_010229/extraits';

const urls = [baseUrl];
for (let offset = 1; offset <= 14; offset++) {
    urls.push(`${baseUrl}?offset=${offset}`);
}

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, page, log, pushData }) {
        const spans = await page.$$eval('span.actual-text', elements =>
            elements.map(el => el.textContent?.trim())
        ); // Récupérer le texte de chaque élément <span> avec la classe "actual-text" donc chaque extrait
        log.info(`✅ ${request.loadedUrl} : ${spans.length} extraits trouvés.`);

        await pushData({ url: request.loadedUrl, texts: spans });
    },
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: urls.length,
});

await crawler.run(urls);
