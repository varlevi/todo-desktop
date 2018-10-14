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
    let newItem = document.createElement("p");
    newItem.classList.add("todo");

    let itemText = parentNode.children[1].value;
    newItem.innerHTML = `
        <i class="fi-check check"></i>
        ${itemText}
    `;

    parentNode.parentNode.insertBefore(newItem, parentNode);
}


function createSection(event) {
    let section = document.createElement("div");
    section.classList.add("section");

    // TODO: Add event listeners to these suckers.
    let title = document.getElementById("input-create").value;
    section.innerHTML = `
        <h2>
          ${title}
          <span role="button" class="section-control section-control-rename">(rename)</span>
          <span role="button" class="section-control section-control-delete">(delete)</span>
        </h2>
        <hr>
        <div class="inline-form">
          <i class="fi-plus add-item"></i>
          <input placeholder="Add item to section"></input>
        </div>
    `;

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
