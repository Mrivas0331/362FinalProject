async function loadAllProducts() {
    const response = await fetch('/getAll');
    const products = await response.json();

    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML ='';

    products.forEach(element => {
        console.log(element.key);
        const productLink = document.createElement('a');
        productLink.href = `/productpage.html?key=${element.key}`;
        console.log(productLink);
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        
        productDiv.innerHTML= `
        <img src="${element.value.img}" alt="${element.value.name}" class="product-image"/>
        <h3>${element.value.name}</h3>
        <p>Price: $${element.value.price}</p>
        <p>${element.value.desc}</p>`;

        productLink.append(productDiv);
        catalogContainer.appendChild(productLink);
    });

}
window.onload = loadAllProducts;