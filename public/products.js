
window.onload = loadAllProducts;
async function loadAllProducts() {
    const response = await fetch('/getAll');
    const products = await response.json();

    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML ='';

    products.forEach(element => {
        console.log(element.key);
        const productLink = document.createElement('a');
        productLink.href = `/productpage.html?key=${element.key}`;
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        
        productDiv.innerHTML= `
        <img src="${element.value.img}" alt="${element.value.name}" class="product-image"/>
        <h3>${element.value.name}</h3>
        <p>Price: $${element.value.price}</p>
        <p class="description">${element.value.desc.length > 20
            ? element.value.desc.slice(0, 20) + '...'
            : element.value.desc}</p>
        <p>${element.value.category}</p>`;

        productLink.append(productDiv);
        catalogContainer.appendChild(productLink);
    });

}

async function displayMen() {
    const response = await fetch('/getMens');
    const products = await response.json();
    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML='';
    products.forEach(element => {
        console.log(element.key);
        const productLink = document.createElement('a');
        productLink.href = `/productpage.html?key=${element.key}`;
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        
        productDiv.innerHTML= `
        <img src="${element.value.img}" alt="${element.value.name}" class="product-image"/>
        <h3>${element.value.name}</h3>
        <p>Price: $${element.value.price}</p>
        <p class="description">${element.value.desc.length > 20
            ? element.value.desc.slice(0, 20) + '...'
            : element.value.desc}</p>
        <p>${element.value.category}</p>`;

        productLink.append(productDiv);
        catalogContainer.appendChild(productLink);
    });
}
async function displayWomen() {
    const response = await fetch('/getWomens');
    const products = await response.json();
    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML='';
    products.forEach(element => {
        console.log(element.key);
        const productLink = document.createElement('a');
        productLink.href = `/productpage.html?key=${element.key}`;
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        
        productDiv.innerHTML= `
        <img src="${element.value.img}" alt="${element.value.name}" class="product-image"/>
        <h3 class ="catalogout">${element.value.name > 20
            ? element.value.name.slice(0, 20) + '...'
            : element.value.name }</h3>
        <p>Price: $${element.value.price}</p>
        <p class="catalogout">${element.value.desc.length > 20
            ? element.value.desc.slice(0, 20) + '...'
            : element.value.desc}</p>
        <p>${element.value.category}</p>`;

        productLink.append(productDiv);
        catalogContainer.appendChild(productLink);
    });
}

async function displayUnisex() {
    const response = await fetch('/getUnisex');
    const products = await response.json();
    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML='';
    products.forEach(element => {
        console.log(element.key);
        const productLink = document.createElement('a');
        productLink.href = `/productpage.html?key=${element.key}`;
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        
        productDiv.innerHTML= `
        <img src="${element.value.img}" alt="${element.value.name}" class="product-image"/>
        <h3 class ="catalogout">${element.value.name > 20
            ? element.value.name.slice(0, 20) + '...'
            : element.value.name }</h3>
        <p>Price: $${element.value.price}</p>
        <p class="catalogout">${element.value.desc.length > 20
            ? element.value.desc.slice(0, 20) + '...'
            : element.value.desc}</p>
        <p>${element.value.category}</p>`;

        productLink.append(productDiv);
        catalogContainer.appendChild(productLink);
    });
}

async function displayAll() {
    loadAllProducts();
}