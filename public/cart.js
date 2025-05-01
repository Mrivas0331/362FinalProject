window.onload = () => {
    const cartContainer = document.getElementById('cart');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    function renderCart() {
      cartContainer.innerHTML = '';
  
      if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }
  
      cart.forEach((product, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
  
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
  };