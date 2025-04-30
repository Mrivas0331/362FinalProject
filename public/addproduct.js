document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save').addEventListener('click', saveData);
    document.getElementById('load').addEventListener('click', loadData);
    document.getElementById('delete').addEventListener('click', deleteData);
})

async function saveData() {
    const key = document.getElementById('key').value;
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const desc = document.getElementById('desc').value;
    const img = document.getElementById('img').value;

    const product = {
        name, 
        price, 
        desc, 
        img
    };

    const response = await fetch('/save', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            key: key,
            product: product
        })
    });
    
    const data = await response.json();
    document.getElementById('result').innerText = data.message;
}

async function loadData() {
    const key = document.getElementById('key').value;
    const response = await fetch(`/get/${key}`);
    const data = await response.json();
    if (response.ok) {
        document.getElementById('keyout').innerText = `${data.key}\n`;
        document.getElementById('nameout').innerText = `${data.value.name}\n`;
        document.getElementById('priceout').innerText = `${data.value.price}\n`;
        document.getElementById('descout').innerText = `${data.value.desc}\n`;
        document.getElementById('imgout').src = `${data.value.img}`;
    } else {
        document.getElementById('result').innerText = data.error;
    }
}

async function deleteData() {
    const key = document.getElementById('key').value;
    const response = await fetch(`/delete/${key}`);
    const data = await response.json();
    if (response.ok) {
        document.getElementById('keyout').innerText = `${key} has been deleted`;
        setTimeout(() => {
            location.reload();
        },0);
    } else {
        document.getElementById('result').innerText = data.error;
    }
}

window.onload = function() {
    document.querySelectorAll("input[type='text']").forEach(input => {
        input.value = "";
    });
}