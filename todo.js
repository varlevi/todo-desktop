// TODO: Undo for section deletion.
'use strict';


function render(data) {
    for (let sectionData of data) {
        let section = createSection(sectionData.title);
        for (let itemData of sectionData.items) {
            addItem(section, itemData.text, itemData.finished);
        }
    }
}


render([
    {
        title: "Thursday",
        items: [
            {
                text: "Read chapter 3 of Sculpting in Time",
                finished: false,
            },
            {
                text: "Finish CS240 midterm",
                finished: true,
            }
        ],
    },
    {
        title: "Friday",
        items: [
            {
                text: "LING399 presentation",
                finished: false,
            },
            {
                text: "Submit request for reimbursement",
                finished: false,
            },
        ],
    },
]);


function deleteSectionHandler(event) {
    let parentNode = event.target.parentNode.parentNode;
    parentNode.remove();
}


function renameSectionHandler(event) {
    let parentNode = event.target.parentNode;
    let newName = window.prompt("Enter the section's new name");
    parentNode.childNodes[0].textContent = newName;
}


function checkOrUncheckHandler(event) {
    let parentNode = event.target.parentNode;
    if (parentNode.classList.contains("todo")) {
        parentNode.classList.replace("todo", "todo-done");
    } else {
        parentNode.classList.replace("todo-done", "todo");
    }
}


function addItemHandler(event) {
    let parentNode = event.target.parentNode;
    addItem(parentNode.parentNode, parentNode.children[1].value, false);
}


function addItem(section, text, finished) {
    // TODO: Figure out a better way than hard-coding the child index.
    let lastChild = section.children[section.children.length-2];
    section.insertBefore(renderItem(text, finished), lastChild);
}


function createSection(title) {
    let form = document.getElementById("form-new-section");
    let root = document.getElementById("container");

    let section = renderSection(title);
    root.insertBefore(section, form);
    return section;
}


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
        let newText = window.prompt("Enter the new value", oldText);
        parentNode.childNodes[1].textContent = " " + newText + " ";
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
