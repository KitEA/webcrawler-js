const { test, expect } = require("@jest/globals");
const { normalizeURL } = require("./crawl.js");

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