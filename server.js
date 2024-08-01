require("dotenv").config();
const http = require("http");
const app = require("./server/app");
const { initializeDatabase } = require("./server/models");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const start = async () => {
  try {

    await initializeDatabase();

    server.listen(PORT, () => {
      console.log(`🚀 [SERVER] is running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(`⚠️ [ERROR], ${error}`);
  }
};

start();
