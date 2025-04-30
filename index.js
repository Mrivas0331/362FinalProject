import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import storage from 'node-persist';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());


storage.init()
    .then((res) => {
        console.log("Initialized storage");
    });

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
// How to catch slug in express
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

app.get('/getProduct/:key', async (req, res) => {
    const key = req.params.key;
    const value = await storage.getItem(key);
    if (!value) {
        return res.status(404).json({error: 'Product not found'});
    }
    res.json({key, value});
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});