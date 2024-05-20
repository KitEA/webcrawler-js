const { crawlPage } = require('./crawl')

function main() {
    if (process.argv.length > 3 || process.argv.length < 3) {
        console.log('Programm accepts only one website!');
        process.exit(1);
    } else {
        console.log(`Starting a crawling process: ${process.argv[2]}`);
    }
    
    const baseURL = process.argv[2];
    crawlPage(baseURL);
}

main();