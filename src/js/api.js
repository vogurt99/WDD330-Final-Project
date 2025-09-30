const BASE_SEARCH_URL = "https://openlibrary.org/search.json";
const BASE_COVER_URL = "https://covers.openlibrary.org/b/id/";

export async function searchBooks(query, page = 1, filters = {}) {
    try {
        if (!query) throw new Error("Search query is required");

        const params = new URLSearchParams();
        params.append("q", query);
        params.append("page", page);

        if (filters.subject) params.append("subject", filters.subject);
        if (filters.sort) params.append("sort", filters.sort);

        const url = `${BASE_SEARCH_URL}?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Search failed: ${res.statusText}`);

        return await res.json();
    } catch (err) {
        console.error(err);
        return { docs: [], numFound: 0 };
    }
}

export function getCoverURL(coverId, size = "M") {
    if (!coverId) return "./src/assets/no-cover.png";
    return `${BASE_COVER_URL}${coverId}-${size}.jpg`;
}