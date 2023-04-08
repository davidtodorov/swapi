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

export function sortData(data, column, dataType) {
    const convertValue = (value) => {
        switch (dataType) {
            case 'text':
                return value.toLowerCase();
            case 'number': {
                const numValue = parseFloat(value.replace(/,/g, ''));
                return isNaN(numValue) ? Number.POSITIVE_INFINITY : numValue;
            }
            case 'date':
                return new Date(value);
            default:
            return value;
        }
    };
    const sortedRows = data.sort((a, b) => {
    const aValue = convertValue(a[column]);
    const bValue = convertValue(b[column]);
        if (aValue === Number.POSITIVE_INFINITY) {
            return 1;
        } else if (bValue === Number.POSITIVE_INFINITY) {
            return -1;
        } else if (aValue < bValue) {
            return -1;
        } else if (aValue > bValue) {
            return 1;
        } else {
            return 0;
        }
    });
    return sortedRows;
}