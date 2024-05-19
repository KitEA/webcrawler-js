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

module.exports  = {
    normalizeURL
}