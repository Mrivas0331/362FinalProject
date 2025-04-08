import express from "express";
import NodePersist from "node-persist";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = NodePersist.create();
storage.init();

const app = express();
const port = 5500;
app.use(express.static(path.join(__dirname, "public")));
app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.use(express.json());



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});