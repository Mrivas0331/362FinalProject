import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import storage from 'node-persist';
import dotenv from 'dotenv';
//creates express server
const app = express();
const PORT = 5500;
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());

//initializes local storage
storage.init()
    .then((res) => {
        console.log("Initialized storage");
    });
//uses firebase details from env file
app.get('/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    });
});
//defines save route (save products)
app.post('/save', async (req, res) => {
    //works here
    const {key, product} = req.body;
    //works here
    if (!key || !product) {
        console.log("stops")
        return res.status(400).send("missing key or value");
    }
    try {
        console.log("works");
        await storage.setItem(key, product);
        console.log(`Received key: ${key}, Product: ${JSON.stringify(product)}`)
        res.send({message: 'Data saved'});
    } catch (error) {
        console.error("Error saving data: ", error);
        res.status(500).send("error saving data");
    }
});
app.post('/set', async (req, res) => {
    //works here
    const {key, product} = req.body;
    //works here
    if (!key || !product) {
        console.log("stops")
        return res.status(400).send("missing key or value");
    }
    try {
        console.log("works");
        await storage.updateItem(key, product);
        console.log(`Changed key: ${key}, Product: ${JSON.stringify(product)}`)
        res.send({message: 'Data saved'});
    } catch (error) {
        console.error("Error saving data: ", error);
        res.status(500).send("error saving data");
    }
});
// How to catch slug in express
//defines get route (gets products)
app.get('/get/:key', async (req, res) => {
    const {key} = req.params;
    console.log(`${key} being displayed`);
    const value = await storage.getItem(key);
    if (value === undefined) {
        res.status(404).send({error: "Key not found"});
    } else {
        res.send({key, value});
    }
});
//defines delete route (delete [duh] products)
app.get('/delete/:key', async (req, res) => {
    const {key} = req.params;
    console.log(`${key} was deleted`);
    const value = await storage.removeItem(key);
    if (value === undefined) {
        res.status(404).send({error: "Key not found"});
    } else {
        res.send({message: "key deleted"});
    }
});
//defines getall route (mostly for the catalog page)
app.get('/getAll', async (req, res) => {
    try {
        const keys = await storage.keys();
        const products = [];
        for (const key of keys) {
            const value = await storage.getItem(key);
            if (value) {
                products.push({key, value});
            }
        }
        res.send(products);
    } catch (error) {
        console.error("Error fetching all products");
        res.status(500).send({error: "fales to load products"});
    }
});
//defines getMens (for catalog)
app.get('/getMens', async (req, res) => {
    try {
        const keys = await storage.keys();
        const products = [];
        for (const key of keys) {
            const value = await storage.getItem(key);
            if (value?.category?.toLowerCase() === "mens") {
                products.push({key, value});
            }
        }
        res.send(products);

    } catch (error) {
        console.error("Error fetching mens: ", error);
        res.status(500).send({error: "Failed to load men's"});
    }
});
//defines getWomens (for catalog)

app.get('/getWomens', async (req, res) => {
    try {
        const keys = await storage.keys();
        const products = [];
        for (const key of keys) {
            const value = await storage.getItem(key);
            if (value?.category?.toLowerCase() === "womens") {
                products.push({key, value});
            }
        }
        res.send(products);

    } catch (error) {
        console.error("Error fetching womens: ", error);
        res.status(500).send({error: "Failed to load womens"});
    }
});
//defines getUnisex (for catalog)

app.get('/getUnisex', async (req, res) => {
    try {
        const keys = await storage.keys();
        const products = [];
        for (const key of keys) {
            const value = await storage.getItem(key);
            if (value?.category?.toLowerCase() === "unisex") {
                products.push({key, value});
            }
        }
        res.send(products);

    } catch (error) {
        console.error("Error fetching womens: ", error);
        res.status(500).send({error: "Failed to load womens"});
    }
});
//defines getproductkey (for the individual product pages)
app.get('/getProduct/:key', async (req, res) => {
    const key = req.params.key;
    const value = await storage.getItem(key);
    if (!value) {
        return res.status(404).json({error: 'Product not found'});
    }
    res.json({key, value});
});
//defines place order route
app.post('/placeOrder', async (req, res) => {
    const order = req.body;
  
    if (!order.name || !order.address || !order.email || !order.items || order.items.length === 0) {
      return res.status(400).json({ error: "Incomplete order data" });
    }
  
    const orderKey = `order-${Date.now()}`;
    try {
      await storage.setItem(orderKey, order);
      res.json({ message: "Order placed" });
    } catch (err) {
      console.error("Save error:", err);
      res.status(500).json({ error: "Failed to save order" });
    }
  });
  //defines getorder route (for orders page)
app.get('/getOrders', async (req, res) => {
    try {
        const keys = await storage.keys();
        const orders = [];

        for (const key of keys) {
            if (key.startsWith('order-')) {
                const order = await storage.getItem(key);
                orders.push({ key, ...order });
            }
        }

        console.log("Fetched Orders:", orders); // Add this log
        res.json(orders);
    } catch (err) {
        console.error("Load error:", err);
        res.status(500).json({ error: "Failed to load orders" });
    }
});
// defines clearorder route (to prevent clogging the page)
  app.delete('/clearOrderHistory', async (req, res) => {
    try {
        const keys = await storage.keys();
        for (const key of keys) {
            if (key.startsWith('order-')) { // Only remove items that are orders
                await storage.removeItem(key);
            }
        }
        res.json({ success: true });
    } catch (error) {
        console.error("Error clearing order history: ", error);
        res.status(500).json({ success: false, message: "Failed to clear order history" });
    }
});
app.get('/search', async (req, res) => {
    const query = req.query.q?.toLowerCase(); 
    if (!query) {
        return res.status(400).send({ error: "Search query is required" });
    }

    try {
        const keys = await storage.keys(); 
        const results = [];

        for (const key of keys) {
            const product = await storage.getItem(key);
            if (product?.name?.toLowerCase().includes(query)) {
                results.push({ key, product });
            }
        }

        res.send(results); 
    } catch (error) {
        console.error("Error searching products: ", error);
        res.status(500).send({ error: "Failed to search products" });
    }
});
// Start the server
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server testing`)
    })
}

export default app;