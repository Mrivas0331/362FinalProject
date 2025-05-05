document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('save').addEventListener('click', saveData);
    document.getElementById('load').addEventListener('click', loadData);
    document.getElementById('delete').addEventListener('click', deleteData);
    document.getElementById('set').addEventListener('click', setData);

})

async function saveData() {
    const key = document.getElementById('key').value;
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const desc = document.getElementById('desc').value;
    const category = document.getElementById('category').value;
    const img = document.getElementById('img').value;
    /*if (!key || !name || isNaN(price) || !desc || !category || !img) {
        document.getElementById('result').innerText = "Please fill in all fields.";
        alert("Must fill all fields");
        return;
    }*/
    const product = {
        name, 
        price, 
        desc, 
        img,
        category
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
async function setData() {
    const key = document.getElementById('key').value;
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const desc = document.getElementById('desc').value;
    const category = document.getElementById('category').value;
    const img = document.getElementById('img').value;
    /*if (!key || !name || isNaN(price) || !desc || !category || !img) {
        document.getElementById('result').innerText = "Please fill in all fields.";
        alert("Must fill all fields");
        return;
    }*/
    const product = {
        name, 
        price, 
        desc, 
        img,
        category
    };

    const response = await fetch('/set', {
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
        document.getElementById('keyout').childNodes[1].nodeValue = ` ${data.key}`;
        document.getElementById('nameout').childNodes[1].nodeValue = ` ${data.value.name}`;
        document.getElementById('priceout').childNodes[1].nodeValue = ` $${data.value.price}`;
        document.getElementById('descout').childNodes[1].nodeValue = ` ${data.value.desc}`;
        document.getElementById('categoryout').childNodes[1].nodeValue = ` ${data.value.category}`;
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