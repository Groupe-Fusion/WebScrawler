// For more information, see https://crawlee.dev/
import { PlaywrightCrawler } from 'crawlee';
import { map } from './map.js';
import { reduce } from './reduce.js';

const baseUrl = 'https://booknode.com/le_seigneur_des_anneaux_tome_1_la_communaute_de_lanneau_010229/extraits';

const urls = [baseUrl];
for (let offset = 1; offset <= 14; offset++) {
    urls.push(`${baseUrl}?offset=${offset}`);
}

const allSmall = [];
const allMedium = [];
const allLong = [];

// PlaywrightCrawler crawls the web using a headless
// browser controlled by the Playwright library.
const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, log, pushData }) {
        const spans = await page.$$eval('span.actual-text', elements => // Récupérer le texte de chaque élément <span> avec la classe "actual-text" donc chaque extrait
            elements.map(el =>
                el.textContent?.trim().replace(/["'«»,:;!?\.']/g, '') // enlève les guillemets et autres caractères spéciaux
            ).filter(Boolean) // enlève les valeurs null ou vides
        );
        log.info(`✅ ${request.loadedUrl} : ${spans.length} extraits trouvés.`);

        const { small, medium, long } = map(spans); // map avant le reduce

        allSmall.push(...small);
        allMedium.push(...medium);
        allLong.push(...long);

        await pushData({ url: request.loadedUrl, text : spans });
    },
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: urls.length,
});

await crawler.run(urls);

console.log('\n Bilan total sur toutes les pages :');
console.log(`   ➤ Petits mots  (<5)  : ${allSmall.length}`);
console.log(`   ➤ Mots moyens (5-9) : ${allMedium.length}`);
console.log(`   ➤ Mots longs  (≥10) : ${allLong.length}`);

reduce({ // reduce après le map
    small: allSmall,
    medium: allMedium,
    long: allLong
});