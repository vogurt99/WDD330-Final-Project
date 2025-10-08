import { searchBooks, getCoverURL } from "./api.js";
import { renderResults, renderPagination, showError } from "./ui.js";

let currentQuery = "";
let currentPage = 1;

async function loadPartial(id, file) {
    try {
        const res = await fetch("/public/partials/" + file);
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        document.getElementById(id).innerHTML = await res.text();
    } catch (err) {
        console.error(err);
    }
}

async function loadPartial(id, file) {
    try {
        const res = await fetch(`./public/partials/${file}`);
        if (!res.ok) throw new Error(`Failed to load ${file}`);
        document.getElementById(id).innerHTML = await res.text();
    } catch (err) {
        console.error(err);
    }
}
function init() {
    loadPartial("main-header", "header.html");
    loadPartial("main-footer", "footer.html");

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const subjectSelect = document.getElementById("subject-select");
    const sortSelect = document.getElementById("sort-select");

    if (searchForm) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            currentQuery = searchInput.value.trim();
            if (!currentQuery) return;

            const filters = {};
            const selectedSubject = subjectSelect.value;
            if (selectedSubject) filters.subject = selectedSubject;

            const selectedSort = sortSelect.value;
            if (selectedSort) filters.sort = selectedSort;

            currentPage = 1;
            await fetchAndRender(currentQuery, currentPage, filters);
        });
    }
}

document.addEventListener("DOMContentLoaded", init);