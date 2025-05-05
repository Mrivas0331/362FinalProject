const loadButton = document.getElementById('load');
const productAttributes = document.querySelector('.product-attributes');
const homeContainer = document.querySelector('.home');

loadButton.addEventListener('click', async () => {
    // Load the product data
    
    // Ensure the product attributes section is visible
    if (!productAttributes.classList.contains('show')) {
        productAttributes.classList.add('show');
        homeContainer.style.height = 'auto'; 
    }

    // The button remains functional for loading other products
});