const WebSocket = require("ws");
const axios = require("axios");

let limit = 20;
let symbol = "BTCUSDT";
let interval;

const fetchData = async () => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`
    );
    const data = response.data;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const startFetchingData = () => {
  fetchData();
  interval = setInterval(fetchData, 1000);
};

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  startFetchingData();

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.symbol) {
      symbol = parsedMessage.symbol.toUpperCase();
      limit = parsedMessage.limit;
      clearInterval(interval);
      startFetchingData();
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
