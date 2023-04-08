export function formatDate(dateString) {
    const date = new Date(dateString);  // Create a new Date object from the string

    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export function getStringValue(value) {
    return value !== 'unknown' ? value : ' - '
}


export function getDataPerPage(result, page) {
    return result.slice((page-1)*10, page*10);
}
