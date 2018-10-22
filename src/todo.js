/**
 * The JavaScript code for the TO-DO app. It handles the following operations:
 *
 *   - Rendering the UI from a JSON list.
 *   - Renaming and deleting sections.
 *   - Editing and deleting items.
 *   - Adding new items.
 *   - Creating new sections.
 *
 *
 * Author:  Ian Fisher (iafisher@protonmail.com)
 * Version: October 2018
 *
 * TODO: Undo for section deletion
 */

"use strict";

const fs = require("fs");
const path = require("path");

const prompt = require("electron-prompt");
const toml = require("toml-js");

const serde = require("./src/serde.js");


setDatePickerDefault();


// Initialize with fallback value.
let save_file = "todo.txt";

// Try to load the path of the to-do file from a config file.
const config_path = path.join(process.env.HOME, ".todo-iafisher");
fs.readFile(config_path, "utf8", (err, data) => {
    if (err) {
        const label = (
            "Enter the path where you want your to-do list to be saved. " +
            "Choose a folder synced by Dropbox or some other cloud service " +
            "in order to access the same list on Android."
        );
        prompt({
            title: "Enter to-do list path",
            label: label,
        }).then((value) => {
            if (value !== null) {
                save_file = value;
            }

            const data = toml.dump({ path: save_file });
            fs.writeFile(config_path, data, (err) => {
                if (err) {
                    console.error("Unable to save config file");
                }
            });

            loadAndRender();
        });
    } else {
        let parsed = toml.parse(data);
        save_file = parsed.path;
        loadAndRender();
    }
});


function loadAndRender() {
    fs.readFile(save_file, "utf8", (err, data) => {
        if (err) {
            render([]);
        } else {
            render(serde.deserialize(data));
        }
    });
}


function renderError(msg) {
    let root = document.getElementById("container");
    while (root.hasChildNodes()) {
        root.removeChild(root.lastChild);
    }
    
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(msg));

    root.appendChild(p);
}


function render(data) {
    for (let sectionData of data) {
        if (sectionData.items.length > 0) {
            let section = createSection(sectionData.title);
            for (let itemData of sectionData.items) {
                addItem(section, itemData.text, itemData.finished);
            }
        }
    }
}


function saveState() {
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
    fs.writeFile(save_file, serde.serialize(data), (err) => {
        if (err) {
            console.error("Unable to save file");
        }
    });
}


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


function serializeItem(item) {
    let text = item.childNodes[1].textContent.trim();
    let finished = item.classList.contains("todo-done");
    return { text: text, finished: finished };
}


function checkOrUncheckHandler(event) {
    let parentNode = event.target.parentNode;
    if (parentNode.classList.contains("todo")) {
        parentNode.classList.replace("todo", "todo-done");
    } else {
        parentNode.classList.replace("todo-done", "todo");
    }
    saveState();
}


/**
 * Insert a new to-do item into the document.
 */
function addItem(section, text, finished) {
    section.appendChild(renderItem(text, finished));
    saveState();
}


/**
 * Find the section that matches the date. If no section matches, a new section
 * is created, inserted into the DOM, and returned.
 */
function findSection(date) {
    let root = document.getElementById("container");

    for (let section of root.querySelectorAll("div.section")) {
        let title = section.children[0].childNodes[0].textContent;
        if (getDateFromHeader(title) === date) {
            return section;
        }
    }

    let fields = date.split("-");
    let month = fields[1];
    let day = fields[2];
    let dayOfWeek = indexToDayOfWeek(new Date(date).getUTCDay());
    return createSection(dayOfWeek + ", " + month + "/" + day);
}


/**
 * From a section header, extract the date.
 */
function getDateFromHeader(header) {
    let fields = header.split(" ");
    let date = fields[fields.length-1];

    let dateFields = date.split("/");
    let month = parseInt(dateFields[0]);
    let day = parseInt(dateFields[1]);
    // TODO: This might break around the New Year.
    // TODO: Should I be using getUTCFullYear() instead?
    let year = new Date().getFullYear();

    return year + "-" + padLeft(month) + "-" + padLeft(day);
}


/**
 * Insert a new section into the document.
 */
function createSection(title) {
    let form = document.getElementById("form-new-item");
    let root = document.getElementById("container");

    let sectionToInsert = renderSection(title);
    let date = getDateFromHeader(title);
    let inserted = false;
    for (let section of root.querySelectorAll("div.section")) {
        let title = section.children[0].childNodes[0].textContent;
        if (date < getDateFromHeader(title)) {
            root.insertBefore(sectionToInsert, section);
            root.insertBefore(document.createElement("hr"), section);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        root.appendChild(sectionToInsert);
        root.appendChild(document.createElement("hr"));
    }

    saveState();

    return sectionToInsert;
}


/**
 * Return a section header as an HTML element (not yet inserted into the
 * document).
 */
function renderSection(title) {
    let section = document.createElement("div");
    section.classList.add("section");

    let header = document.createElement("h2");
    header.appendChild(document.createTextNode(title));

    section.appendChild(header);

    return section;
}


/**
 * Return a to-do item as an HTML element (not yet inserted into the document).
 */
function renderItem(text, finished) {
    let newItem = document.createElement("p");
    newItem.classList.add(finished ? "todo-done" : "todo");

    let check = document.createElement("i");
    check.classList.add("fi-check", "check");
    check.addEventListener("click", checkOrUncheckHandler);

    let editButton = document.createElement("span");
    editButton.classList.add("item-control");
    editButton.appendChild(document.createTextNode("(edit)"));
    editButton.addEventListener("click", event => {
        let parentNode = event.target.parentNode;
        let oldText = parentNode.childNodes[1].textContent.trim();
        prompt({
            title: "Edit list item",
            label: "Enter the new value:",
            value: oldText,
        }).then((value) => {
            if (value !== null) {
                parentNode.childNodes[1].textContent = " " + value + " ";
                saveState();
            }
        });
    });

    let deleteButton = document.createElement("span");
    deleteButton.classList.add("item-control");
    deleteButton.appendChild(document.createTextNode("(delete)"));
    deleteButton.addEventListener("click", event => {
        let parentNode = event.target.parentNode;
        let section = parentNode.parentNode;
        parentNode.remove();

        // Remove the section as well, if it has no to-do items.
        if (section.querySelectorAll("p").length === 0) {
            // Remove the <hr> after the section.
            section.nextSibling.remove();
            section.remove();
        }

        saveState();
    });

    newItem.appendChild(check);
    newItem.appendChild(document.createTextNode(" " + text + " "));
    newItem.appendChild(editButton);
    newItem.appendChild(document.createTextNode(" "));
    newItem.appendChild(deleteButton);

    return newItem;
}


/**
 * Set the default value for the date picker to be tomorrow.
 */
function setDatePickerDefault() {
    const datePicker = document.getElementById("new-item-date");
    let tomorrow = new Date();
    // TODO: Should I be using getUTC*() instead?
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = tomorrow.getMonth() + 1;
    const dd = tomorrow.getDate();
    datePicker.value = yyyy + "-" + padLeft(mm) + "-" + padLeft(dd);
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


let addButton = document.getElementById("new-item-btn");
addButton.addEventListener("click", event => {
    let textInput = document.getElementById("new-item-text");
    let text = textInput.value.trim();
    let date = document.getElementById("new-item-date").value;

    if (text.length > 0) {
        let section = findSection(date);
        addItem(section, text, false);
        textInput.value = "";
    }
});
