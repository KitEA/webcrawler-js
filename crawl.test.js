const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl.js");

test('normalizeURL empty string', () => {
    const actual = normalizeURL('');
    const expected = '';
    expect(actual).toEqual(expected);
});

test('normalizeURL strip protocol', () => {
    const actual = normalizeURL('https://blog.boot.dev/path');
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('normalizeURL strip trailing slash', () => {
    const actual = normalizeURL('https://blog.boot.dev/path/');
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('normalizeURL capitals', () => {
    const actual = normalizeURL('https://BLOG.boot.dev/path');
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('normalizeURL strip http', () => {
    const actual = normalizeURL('http://blog.boot.dev/path');
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/">Boot.dev blog</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/'];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="/path/">Boot.dev blog</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1/">Boot.dev blog Path One</a>
            <a href="/path2/">Boot.dev blog Path Two</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/'];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML invalid', () => {
    const inputHTMLBody = `
    <html>
        <body>
            <a href="Invalid">Invalid URL</a>
        </body>
    </html>
    `;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected);
});