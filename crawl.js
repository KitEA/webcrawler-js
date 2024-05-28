const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
    if (baseURL !== currentURL && notOnTheSameDomain(currentURL, baseURL)) {
        return pages;
    }
    const normalizedCurrentURL = normalizeURL(currentURL);

    if (pages[normalizedCurrentURL]) {
        pages[normalizedCurrentURL]++;
        return pages;
    }
    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling: ${currentURL}`)

    let html = '';
    try {
        html = await fetchHTML(currentURL); 
    } catch (error) {
        console.log(`${error.message}`)
        return pages;
    }
    pages = await parseTheHTML(html, baseURL, pages);
    
    return pages;
}

async function fetchHTML(url) {
    let response
    try {
      response = await fetch(url);
    } catch (err) {
      throw new Error(`Network error: ${err.message}`);
    }
  
    if (response.status > 399) {
      throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }
  
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`Non-HTML response: ${contentType}`);
    }
  
    return response.text();
  }

  async function parseTheHTML(html, baseURL, pages) {;
    const urls = getURLsFromHTML(html, baseURL);

    for (const url of urls) {
        pages = await crawlPage(baseURL, url, pages);
    }

    return pages;
}

function notOnTheSameDomain(currentURL, baseURL) {
    const baseUrlObj = new URL(baseURL);
    const currentUrlObj = new URL(currentURL);
    
    return baseUrlObj.hostname !== currentUrlObj.hostname;
}

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

module.exports  = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}