import NodePersist from "node-persist";

const storage = NodePersist.create();
await storage.init();

export default storage;