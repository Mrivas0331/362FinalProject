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
        document.getElementById('imgout').src = `${data.value.img}`;

    } catch (err) {
        console.error(err);
        document.getElementById('result').innerText = 'Error loading product';
    }
}
