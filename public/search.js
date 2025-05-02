document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector("[product-search]");
    if (!searchInput) {
        console.error("Search input with [product-search] attribute not found.");
        return;
    }

    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            const query = searchInput.value.trim();
            if (!query) {
                alert("Please enter a search term.");
                return;
            }

            
            const newUrl = `products.html?search=${encodeURIComponent(query)}`;
            if (window.location.pathname.includes("products.html")) {
                history.pushState(null, "", newUrl); 
                window.dispatchEvent(new Event("popstate")); 
                window.location.reload(); 
            } else {
            
                window.location.href = newUrl;
            }
        }
    });
});