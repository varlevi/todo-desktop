// TODO: Allow deletion of items.
'use strict';


function render(data) {
    // TODO
}


function deleteSection(event) {
    let parentNode = event.target.parentNode.parentNode;
    parentNode.remove();
}


function renameSection(event) {
    let parentNode = event.target.parentNode;
    let newName = window.prompt("Enter the section's new name") + " ";
    parentNode.childNodes[0].textContent = newName;
}


function checkOrUncheck(event) {
    let parentNode = event.target.parentNode;
    if (parentNode.classList.contains("todo")) {
        parentNode.classList.replace("todo", "todo-done");
    } else {
        parentNode.classList.replace("todo-done", "todo");
    }
}


function addItem(event) {
    let parentNode = event.target.parentNode;
    let itemText = parentNode.children[1].value;
    parentNode.parentNode.insertBefore(renderItem(itemText), parentNode);
}


function createSection(event) {
    let title = document.getElementById("input-create").value;
    let section = renderSection(title);

    let form = document.getElementById("form-new-section");
    let root = document.getElementById("container");
    root.insertBefore(section, form);
}


let checks = document.getElementsByClassName("check");
for (let check of checks) {
    check.addEventListener("click", checkOrUncheck);
}


let deleteButtons = document.getElementsByClassName("section-control-delete");
for (let button of deleteButtons) {
    button.addEventListener("click", deleteSection);
}


let renameButtons = document.getElementsByClassName("section-control-rename");
for (let button of renameButtons) {
    button.addEventListener("click", renameSection);
}


// TODO: Also trigger this event on input <ENTER>
let addButtons = document.getElementsByClassName("add-item");
for (let button of addButtons) {
    button.addEventListener("click", addItem);
}


// TODO: Also trigger this event on input <ENTER>
let createButton = document.getElementById("btn-create");
createButton.addEventListener("click", createSection);


function renderSection(title) {
    let section = document.createElement("div");
    section.classList.add("section");

    let header = document.createElement("h2");
    header.appendChild(document.createTextNode(title));
    
    let renameButton = document.createElement("span");
    renameButton.setAttribute("role", "button");
    renameButton.classList.add("section-control", "section-control-rename");
    renameButton.appendChild(document.createTextNode("(rename)"));
    renameButton.addEventListener("click", renameSection);
    
    let deleteButton = document.createElement("span");
    deleteButton.setAttribute("role", "button");
    deleteButton.classList.add("section-control", "section-control-delete");
    deleteButton.appendChild(document.createTextNode("(delete)"));
    deleteButton.addEventListener("click", deleteSection);

    header.appendChild(document.createTextNode(" "));
    header.appendChild(renameButton);
    header.appendChild(document.createTextNode(" "));
    header.appendChild(deleteButton);

    let form = document.createElement("div");
    form.classList.add("inline-form");

    let addButton = document.createElement("i");
    addButton.classList.add("fi-plus", "add-item");
    addButton.addEventListener("click", addItem);

    let addInput = document.createElement("input");
    addInput.setAttribute("placeholder", "Add item to section");

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


function renderItem(text) {
    let newItem = document.createElement("p");
    newItem.classList.add("todo");

    let check = document.createElement("i");
    check.classList.add("fi-check", "check");
    check.addEventListener("click", checkOrUncheck);

    newItem.appendChild(check);
    newItem.appendChild(document.createTextNode(text));

    return newItem;
}
