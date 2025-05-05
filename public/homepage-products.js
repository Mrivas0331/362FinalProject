async function loadPopularProducts() {
    try {
        // Specify the keys of the products you want to display
        const productKeys = ["black-shirt", "dress", "tealsweater", "sweater"]; // Replace with your desired keys

        // Fetch specific products from the backend
        const response = await fetch('/getSpecificProducts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keys: productKeys }),
        });
        const products = await response.json();

        // Select the container for popular products
        const row = document.querySelector('.popular-products .row');
        row.innerHTML = ''; // Clear existing content

        // Dynamically create product elements
        products.forEach(({ key, value }) => {
            const productLink = document.createElement('a');
            productLink.href = `productpage.html?key=${key}`; 
            productLink.style.textDecoration = 'none'; 
            productLink.style.color = 'inherit';

            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            productDiv.innerHTML = `
                <img src="${value.img}" alt="${value.name}">
                <section class="product-info">
                    <h3>${value.name}</h3>
                    <p>${value.desc}</p>
                    <p>$${value.price}</p>
                    <button class="add-to-cart-button" data-key="${key}">Add to Cart</button>
                </section>
            `;

            productLink.appendChild(productDiv);
            row.appendChild(productLink);
        });

      
        const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault(); 

                const key = event.target.getAttribute('data-key');
                const product = products.find(item => item.key === key).value;

                // Add the product to the cart in localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.push({
                    key,
                    name: product.name,
                    price: product.price,
                    img: product.img,
                });
                localStorage.setItem('cart', JSON.stringify(cart));

                alert(`${product.name} has been added to your cart!`);
            });
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Load products when the page is ready
document.addEventListener('DOMContentLoaded', loadPopularProducts);