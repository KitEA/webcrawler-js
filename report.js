import { sortOccurrencesObj } from './utility.js'

function printReport(pages) {
    console.log("Forming the report..");
    const sortedPages = sortOccurrencesObj(pages);
    
    Object.entries(sortedPages).forEach(([url, count]) => {
        console.log(`Found ${count} internal links to ${url}`);
    });
}

export { printReport };