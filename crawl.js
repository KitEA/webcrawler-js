const { JSDOM } = require('jsdom');

function normalizeURL(url) {
    if (url.length === 0) {
        return url;
    } 

    const urlObj = new URL(url);
    const normalizedURL = `${urlObj.hostname}${urlObj.pathname}`

    if (url.length !== 0 && normalizedURL.slice(-1) === '/') {
        return normalizedURL.slice(0, -1);
    }

    return normalizedURL;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];

    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll("a");

    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === '/'){
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (error) {
                console.log(`Invalid URL: ${error.message}`);
            }
        } else {
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (error) {
                console.log(`Invalid URL: ${error.message}`);
            }
        }
    }

    return urls;
}

async function crawlPage(url) {
    try {
        const response = await fetch(url);

        if (response.status > 399) {
            console.log(`error in fetch with status code: ${response.status}, on page: ${url}`)
            return
        } 
        
        const contentType = response.headers.get('content-type');
        
        if (!contentType.includes('text/html')) {
            console.log(`not html response, content type: ${contentType}, on page: ${url}`)
            return
        }

        console.log(await response.text());
    } catch (error) {
        console.log(`error in fetch: ${error.message}, on page: ${url}`)
    }
}

module.exports  = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}