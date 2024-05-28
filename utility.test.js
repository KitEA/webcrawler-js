import { test, expect } from '@jest/globals'
import { sortOccurrencesObj } from './utility.js'

test('should sort pages obj by value, desc', () => {
    const input = {
        'tesla': 2,
        'car': 5,
        'bus': 3,
        'planes': 10
    };
    const actual = sortOccurrencesObj(input);
    const expected = {
        'planes': 10,
        'car': 5,
        'bus': 3,
        'tesla': 2
    };
    expect(actual).toEqual(expected);
});

test('should return an empty obj if nothing is passed', () => {
    const input = {};
    const actual = sortOccurrencesObj(input);
    const expected = {};
    expect(actual).toEqual(expected);
});