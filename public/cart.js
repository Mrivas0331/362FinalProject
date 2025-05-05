window.onload = () => {
    const cartContainer = document.getElementById('cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    //creates cart
    function renderCart() {
      cartContainer.innerHTML = '';
  
      if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }
      
      cart.forEach((product, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        //populates cart info
        itemDiv.innerHTML = `
          <div class="cart-item-info">
            <img src="${product.img}" alt="${product.name}" class="cart-item-image" />
            <div>
              <h3>${product.name}</h3>
              <p>Price: $${product.price}</p>
            </div>
          </div>
          <button class="remove-btn" data-index="${index}">Remove</button>
        `;
  
        cartContainer.appendChild(itemDiv);
      });
      const total = cart.reduce((sum, product) => sum + product.price, 0);

      // Display price
      const totalDiv = document.createElement('div');
      totalDiv.classList.add('cart-total');
      totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
      cartContainer.appendChild(totalDiv);
      // Attach remove button listeners
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = e.target.getAttribute('data-index');
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          renderCart();
        });
      });
    }
  
    // Clear all cart items
    document.getElementById('clear-cart').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear the cart?')) {
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
      }
    });
  
    renderCart();
    //uses buttons in html
    const checkoutSection = document.getElementById('checkout-section');
    const checkoutBtn = document.getElementById('checkout-btn');

    checkoutBtn.addEventListener('click', () => {
      checkoutSection.style.display = 'block'; // reveal form
    });

    document.getElementById('place-order').addEventListener('click', async () => {
      const name = document.getElementById('name').value;
      const address = document.getElementById('address').value;
      const email = document.getElementById('email').value;
      //ensures all fields are filled
      if (!name || !address || !email || cart.length === 0) {
        alert('Please fill all fields and make sure cart is not empty');
        return;
      }
      //defines order object
      const order = {
        name,
        address,
        email,
        items: cart,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // +5 days
      };
      //uses place order express route
      const res = await fetch('/placeOrder', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order)
      });

      if (res.ok) {
        alert('Order placed!');
        localStorage.removeItem('cart');
        cart = [];
        renderCart();
        checkoutSection.style.display = 'none';
      } else {
        alert('Failed to place order.');
      }
    });
  };