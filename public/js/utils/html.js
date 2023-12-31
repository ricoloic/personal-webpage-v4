function isClickAway(elements, targetElement) {
    while (targetElement) {
        for (const elem of elements) if (elem === targetElement) return false;
        targetElement = targetElement.parentNode;
    }
    return true;
}

function findClassIndex(elem, classToFind) {
    return elem.className.split(" ").findIndex((c) => c === classToFind);
}

function removeClass(elem, classToRemove) {
    const index = findClassIndex(elem, classToRemove);

    if (index !== -1) {
        const classes = elem.className.split(" ");
        classes.splice(index, 1);
        elem.className = classes.join(" ");
    }
}

function removeClasses(elem, classesToRemove) {
    for (const c of classesToRemove) removeClass(elem, c);
}

function addClass(elem, classToAdd) {
    const index = findClassIndex(elem, classToAdd);

    if (index === -1) elem.className += ` ${classToAdd}`;
}

function addClasses(elem, classesToAdd) {
    for (const c of classesToAdd) addClass(elem, c);
}

function toggleCheckbox(checkbox) {
    if (checkbox.hasAttribute("checked")) checkbox.removeAttribute("checked");
    else checkbox.setAttribute("checked", "");
}

function $(s) {
    if (typeof s === "function") {
        window.onload = (e) => s(e);
    } else if (typeof s === "string") {
        const elems = document.querySelectorAll(s);
        if (elems.length < 2) return elems[0];
        return elems;
    }
}
