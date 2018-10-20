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
        let section = createSection(sectionData.title);
        for (let itemData of sectionData.items) {
            addItem(section, itemData.text, itemData.finished);
        }
    }
}


function saveState() {
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


function deleteSectionHandler(event) {
    let parentNode = event.target.parentNode.parentNode;
    parentNode.remove();
    saveState();
}


function renameSectionHandler(event) {
    let parentNode = event.target.parentNode;
    prompt({
        title: "Rename section",
        label: "Enter the section's new name:",
        value: parentNode.childNodes[0].textContent,
    }).then((value) => {
        if (value !== null) {
            parentNode.childNodes[0].textContent = value;
            saveState();
        }
    });
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


function addItemHandler(event) {
    let parentNode = event.target.parentNode;
    addItem(parentNode.parentNode, parentNode.children[1].value, false);
}


function addItem(section, text, finished) {
    // TODO: Figure out a better way than hard-coding the child index.
    let lastChild = section.children[section.children.length-2];
    section.insertBefore(renderItem(text, finished), lastChild);
    saveState();
}


function createSection(title) {
    let form = document.getElementById("form-new-section");
    let root = document.getElementById("container");

    let section = renderSection(title);
    root.insertBefore(section, form);

    saveState();

    return section;
}


function renderSection(title) {
    let section = document.createElement("div");
    section.classList.add("section");

    let header = document.createElement("h2");
    header.appendChild(document.createTextNode(title));
    
    let renameButton = document.createElement("span");
    renameButton.setAttribute("role", "button");
    renameButton.classList.add("section-control", "section-control-rename");
    renameButton.appendChild(document.createTextNode("(rename)"));
    renameButton.addEventListener("click", renameSectionHandler);
    
    let deleteButton = document.createElement("span");
    deleteButton.setAttribute("role", "button");
    deleteButton.classList.add("section-control", "section-control-delete");
    deleteButton.appendChild(document.createTextNode("(delete)"));
    deleteButton.addEventListener("click", deleteSectionHandler);

    header.appendChild(document.createTextNode(" "));
    header.appendChild(renameButton);
    header.appendChild(document.createTextNode(" "));
    header.appendChild(deleteButton);

    let form = document.createElement("div");
    form.classList.add("inline-form");

    let addButton = document.createElement("i");
    addButton.classList.add("fi-plus", "add-item");
    addButton.addEventListener("click", event => {
        let parentNode = event.target.parentNode;
        addItem(parentNode.parentNode, parentNode.children[1].value, false);
    });

    let addInput = document.createElement("input");
    addInput.setAttribute("placeholder", "Add item to section");
    addInput.addEventListener("keyup", event => {
        if (event.which === 13) {
            let parentNode = event.target.parentNode;
            addItem(parentNode.parentNode, parentNode.children[1].value, false);
            parentNode.children[1].value = "";
        }
    });

    form.appendChild(addButton);
    form.appendChild(addInput);

    section.appendChild(header);
    section.appendChild(document.createElement("hr"));
    section.appendChild(form);

    let hrBottom = document.createElement("hr");
    hrBottom.classList.add("bottom-hr");
    section.appendChild(hrBottom);

    return section;
}


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
        parentNode.remove();
    });

    newItem.appendChild(check);
    newItem.appendChild(document.createTextNode(" " + text + " "));
    newItem.appendChild(editButton);
    newItem.appendChild(document.createTextNode(" "));
    newItem.appendChild(deleteButton);

    return newItem;
}


// Bind some event listeners.
let createInput = document.getElementById("input-create");
createInput.addEventListener("keyup", event => {
    if (event.which === 13) {
        createSection(event.target.value);
        event.target.value = "";
    }
});


let createButton = document.getElementById("btn-create");
createButton.addEventListener("click", event => {
    let createInput = document.getElementById("input-create");
    createSection(createInput.value);
    createInput.value = "";
});


