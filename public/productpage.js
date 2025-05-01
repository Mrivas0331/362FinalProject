window.onload = async() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key');

    if (!key) {
        document.body.innerHTML = '<p>No product</p>';
        return;
    }
    try {
        const response = await fetch(`/getProduct/${key}`);
        if (!response.ok) {
            document.body.innerHTML = '<p>Product not found</p>';
            return;
        }
        const data = await response.json();
        document.getElementById('keyout').innerText = `${data.key}\n`;
        document.getElementById('nameout').innerText = `${data.value.name}\n`;
        document.getElementById('priceout').innerText = `${data.value.price}\n`;
        document.getElementById('descout').innerText = `${data.value.desc}\n`;
        document.getElementById('categoryout').innerText = `${data.value.category}\n`
        document.getElementById('imgout').src = `${data.value.img}`;

        //makes the add to cart feature
        document.getElementById('addtocart').addEventListener('click', () => {
            const product = {
                key: data.key,
                name: data.value.name,
                img: data.value.img,
                price: data.value.price
            };
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(cart);
            alert('Product added to cart!');
        })

    } catch (err) {
        console.error(err);
        document.getElementById('result').innerText = 'Error loading product';
    }
}
