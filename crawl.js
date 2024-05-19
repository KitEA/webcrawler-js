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

module.exports  = {
    normalizeURL,
    getURLsFromHTML
}