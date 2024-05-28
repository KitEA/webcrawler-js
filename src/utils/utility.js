function sortOccurrencesObj(objToSort) {
    return Object.fromEntries(
        Object.entries(objToSort).sort(([,a],[,b]) => b - a)
    );
}

export { sortOccurrencesObj };