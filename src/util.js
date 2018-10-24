/**
 * From a section header, extract the date.
 */
function getDateFromHeader(header) {
    let fields = header.split(" ");
    let date = fields[fields.length-1];

    let dateFields = date.split("/");
    let month = parseInt(dateFields[0]);
    let day = parseInt(dateFields[1]);
    let year;
    if (dateFields.length === 3) {
        year = dateFields[2];
    } else {
        // TODO: This might break around the New Year.
        // TODO: Should I be using getUTCFullYear() instead?
        year = new Date().getFullYear();
    }

    return year + "-" + padLeft(month) + "-" + padLeft(day);
}


/**
 * If the given positive integer is less than 10, prepend a '0'.
 */
function padLeft(d) {
    return (d < 10) ? "0" + d : "" + d;
}


/**
 * Given an index 0-6, return the corresponding day of the week.
 */
function indexToDayOfWeek(index) {
    switch (index) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "unknown day of the week";
    }
}


exports.getDateFromHeader = getDateFromHeader;
exports.padLeft = padLeft;
exports.indexToDayOfWeek = indexToDayOfWeek;
