const loadButton = document.getElementById('load');
const productAttributes = document.querySelector('.product-attributes');
const homeContainer = document.querySelector('.home');

loadButton.addEventListener('click', async () => {
 
    
    if (!productAttributes.classList.contains('show')) {
        productAttributes.classList.add('show');
        homeContainer.style.height = 'auto'; 
    }

});