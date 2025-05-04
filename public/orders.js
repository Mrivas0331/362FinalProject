async function loadOrders() {
    try {
        //uses get orders route
        const res = await fetch('/getOrders');
        const orders = await res.json();
        const container = document.getElementById('orders-container');

        if (orders.length === 0) {
            container.innerHTML = "<p>No orders yet.</p>";
            return;
        }
        //displays orders
        orders.forEach(order => {
            const orderEl = document.createElement('div');
            orderEl.classList.add('order');
            const orderDate = new Date(order.createdAt).toLocaleString();
            const deliveryDate = new Date(order.estimatedDelivery).toLocaleDateString();

            orderEl.innerHTML = `
                <h3>Order for ${order.name}</h3>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Shipping To:</strong> ${order.address}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Estimated Delivery:</strong> ${deliveryDate}</p>
                <h4>Items:</h4>
                <ul>
                ${order.items.map(item => `<li class="order-item">${item.name} - $${item.price}</li>`).join('')}
                </ul>
            `;
            container.appendChild(orderEl);
        });
    } catch (err) {
        console.error("Failed to load orders", err);
        document.getElementById('orders-container').innerHTML = "<p>Error loading orders.</p>";
    }
}
//clears orders for clogging
async function clearOrderHistory() {
    if (!confirm("Are you sure you want to clear your entire order history?")) return;

    try {
        const res = await fetch('/clearOrderHistory', {
            method: 'DELETE', // or POST depending on your API design
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await res.json();
        if (result.success) {
            alert("Order history cleared successfully.");
            // Optionally, refresh the order display here
            document.getElementById('orders-container').innerHTML = "<p>No orders yet.</p>";
        } else {
            alert("Failed to clear order history.");
        }
    } catch (err) {
        console.error("Error clearing order history:", err);
        alert("An error occurred while clearing the order history.");
    }
}
document.getElementById('clearOrderHistoryButton').addEventListener('click', clearOrderHistory);

window.addEventListener('DOMContentLoaded', loadOrders);