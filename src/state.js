/**
 * Loading and saving the state of the application to disk.
 *
 *
 * Author:  Ian Fisher (iafisher@protonmail.com)
 * Version: October 2018
 */

const fs = require("fs");

const serde = require("./serde.js");


/**
 * Save the state of the to-do list to the given file path. The state is 
 * automatically loaded from the elements in the DOM.
 */
function save(file) {
    if (process.env.DEBUG) {
        return;
    }

    let root = document.getElementById("container");
    let data = [];
    for (let child of root.children) {
        if (child.classList.contains("section")) {
            data.push(serializeSection(child));
        }
    }
    fs.writeFile(file, serde.serialize(data), (err) => {
        if (err) {
            console.error("Unable to save file");
        }
    });
}


/**
 * Load the application state from the given file path and invoke the callback 
 * with the data when it is available.
 *
 * `callback` should be a function that accepts a single argument, `data`,
 * whose schema is defined in the `serde.js` module.
 */
function load(file, callback) {
    fs.readFile(file, "utf8", (err, data) => {
        if (err) {
            callback([]);
        } else {
            callback(serde.deserialize(data));
        }
    });
}


/**
 * Convert a <div class="section"> element to an object of the form
 *
 *     {
 *       title: "...", 
 *       items: [ 
 *         (see serializeItem comment for item schema)
 *       ]
 *     }
 */
function serializeSection(section) {
    let title = section.children[0].childNodes[0].textContent.trim();
    let items = [];
    for (let child of section.children) {
        if (child.classList.contains("todo") || child.classList.contains("todo-done")) {
            items.push(serializeItem(child));
        }
    }
    return { title: title, items: items };
}


/**
 * Convert a <li> element to an object of the form
 *
 *     { text: "...", finished: true/false }
 */
function serializeItem(item) {
    let text = item.childNodes[1].textContent.trim();
    let finished = item.classList.contains("todo-done");
    return { text: text, finished: finished };
}


exports.save = save;
exports.load = load;
