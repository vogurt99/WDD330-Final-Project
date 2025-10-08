import { getCoverURL } from "./api.js";

const resultsGrid = document.getElementById("results-grid");
const paginationControls = document.getElementById("pagination-controls");

// Render search results as book cards
export function renderResults(books) {
    resultsGrid.innerHTML = "";

    if (!books || books.length === 0) {
        resultsGrid.innerHTML = "<p>No results found.</p>";
        return;
    }

    books.forEach((book) => {
        const cover = book.cover_i
            ? getCoverURL(book.cover_i)
            : "/images/placeholder_small.png"; // Placeholder image in case there is none

        const authors = book.author_name ? book.author_name.join(", ") : "Unknown author";

        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
      <img src="${cover}" alt="Cover of ${book.title}" />
      <h3>${book.title}</h3>
      <p>${authors}</p>
    `;

        card.addEventListener("click", () => showDetailModal(book));

        resultsGrid.appendChild(card);
    });
}

// Modal for detailed book info
function showDetailModal(book) {
    console.log(book);
    const modal = document.createElement("div");
    modal.className = "modal";

    // Accessibility attributes added
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");

    const cover = book.cover_i
        ? getCoverURL(book.cover_i, "L")
        : "/images/placeholder_large.png"; // Placeholder image in case there is none
    const authors = book.author_name ? book.author_name.join(", ") : "Unknown author";
    const publishYear = book.first_publish_year || "Unknown year";

    modal.innerHTML = `
    <div class="modal-content" tabindex="-1">
      <button class="close" aria-label="Close modal">&times;</button>
      <img src="${cover}" alt="Cover of ${book.title}" />
      <h2>${book.title}</h2>
      <p><strong>Author(s):</strong> ${authors}</p>
      <p><strong>Published:</strong> ${publishYear}</p>
    </div>
  `;

    document.body.appendChild(modal);

    const modalContent = modal.querySelector(".modal-content");
    const closeBtn = modal.querySelector(".close");

    // Focus moves to modal content when opened
    modalContent.focus();

    // Close modal functions
    const closeModal = () => modal.remove();
    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    // Close with Escape key
    const escListener = (e) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", escListener);

    // Remove Escape listener when modal closes
    modal.addEventListener("remove", () => document.removeEventListener("keydown", escListener));

    // Focus trap inside modal (so Tab doesn't leave it)
    modal.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            const focusable = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else { // Tab
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    });
}

// Pagination
export function renderPagination(totalResults, currentPage, onPageClick) {
    paginationControls.innerHTML = "";

    const totalPages = Math.ceil(totalResults / 100);
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Prev";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => onPageClick(currentPage - 1));
    paginationControls.appendChild(prevBtn);

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        if (i === currentPage) pageBtn.disabled = true;
        pageBtn.addEventListener("click", () => onPageClick(i));
        paginationControls.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Next";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => onPageClick(currentPage + 1));
    paginationControls.appendChild(nextBtn);
}

export function showError(message) {
    resultsGrid.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
}