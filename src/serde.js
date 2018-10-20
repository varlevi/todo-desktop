/**
 * Functions to serialize and deserialize data from the constrained Markdown
 * format in which the TO-DO app saves its list.
 *
 * Author:  Ian Fisher (iafisher@protonmail.com)
 * Version: October 2018
 */


/**
 * Convert the data into a Markdown document (as a string).
 */
function serialize(data) {
    let doc = "";
    for (let section of data) {
        doc += "=== " + section.title.trim() + " ===\n";
        for (let item of section.items) {
            if (item.finished) {
                doc += "- [x] " + item.text.trim() + "\n";
            } else {
                doc += "- [ ] " + item.text.trim() + "\n";
            }
        }
        doc += "\n";
    }
    return doc;
}


/**
 * Convert the Markdown document into a list of objects.
 */
function deserialize(markdown) {
    let data = [];
    let currentSection = null;
    let currentItems = [];
    for (let line of markdown.split("\n")) {
        line = line.trim();
        if (line.startsWith("===") && line.endsWith("===")) {
            if (currentSection !== null || currentItems.length > 0) {
                if (currentSection === null) {
                    // Default section title when none is given.
                    currentSection = "Tasks";
                }
                data.push({ title: currentSection, items: currentItems });
            }
            currentSection = line.slice(3, -3).trim();
            currentItems = [];
        } else if (line.startsWith("-")) {
            line = line.slice(1);
            currentItems.push(deserializeLine(line));
        }
    }
    if (currentSection !== null || currentItems.length > 0) {
        if (currentSection === null) {
            // Default section title when none is given.
            currentSection = "Tasks";
        }
        data.push({ title: currentSection, items: currentItems });
    }
    return data;
}


/**
 * Deserialize a single line into a { text: ..., finished: ... } object. The
 * line should not include the leading dash.
 */
function deserializeLine(line) {
    line = line.trim();
    if (line.startsWith("[x]")) {
        return { text: line.slice(3).trim(), finished: true };
    } else if (line.startsWith("[ ]")) {
        return { text: line.slice(3).trim(), finished: false };
    } else {
        // Handle a missing "[ ]" gracefully.
        return { text: line.trim(), finished: false };
    }
}


exports.serialize = serialize;
exports.deserialize = deserialize;
