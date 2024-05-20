const { JSDOM } = require('jsdom');

function normalizeURL(url) {
    if (url.length === 0) {
        return url;
    } 

    const urlObj = new URL(url);
    const normalizedURL = `${urlObj.hostname}${urlObj.pathname}`

    return linkContainsSlashAtLastPosition(url, normalizedURL) 
        ? removeSlashAtLastPosition(normalizedURL) 
        : normalizedURL;
}

function linkContainsSlashAtLastPosition(url, normalizedURL) {
    return url.length !== 0 && normalizedURL.slice(-1) === '/';
}

function removeSlashAtLastPosition(normalizedURL) {
    return normalizedURL.slice(0, -1);
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];

    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll("a");

    for (const linkElement of linkElements) {
        checkIfRelativeURL(linkElement) 
            ? transformToAbsoluteAndAdd(baseURL, linkElement, urls) 
            : addAbsouluteURL(linkElement, urls);
    }

    return urls;
}

function checkIfRelativeURL(linkElement) {
    return linkElement.href.slice(0, 1) === '/';
}

function transformToAbsoluteAndAdd(baseURL, linkElement, urls) {
    try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
    } catch (error) {
        console.log(`Invalid URL: ${error.message}`);
    }
}

function addAbsouluteURL(linkElement, urls) {
    try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
    } catch (error) {
        console.log(`Invalid URL: ${error.message}`);
    }
}

async function crawlPage(url) {
    try {
        const response = await fetch(url);
        const contentType = response.headers.get('content-type');

        if (response.status > 399) {
            console.log(`error in fetch with status code: ${response.status}, on page: ${url}`);
        } else if (!contentType.includes('text/html')) {
            console.log(`not html response, content type: ${contentType}, on page: ${url}`);
        } else {
            console.log(await response.text());
        }
    } catch (error) {
        console.log(`error in fetch: ${error.message}, on page: ${url}`);
    }
}

module.exports  = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}