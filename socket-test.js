const { io } = require("socket.io-client");
const axios = require("axios");
require("dotenv").config();

console.log("ADMIN_TOKEN:", process.env.ADMIN_TOKEN?.slice(0, 25));

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error("ADMIN_TOKEN missing");
  process.exit(1);
}

const socket = io("http://localhost:2209", {
  auth: { token: ADMIN_TOKEN },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Admin socket connected");
});

socket.on("book:added", async (data) => {
  console.log("Book added event:", data);

  try {
    const res = await axios.get("http://localhost:2209/api/books", {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log("API RAW RESPONSE TYPE:", Array.isArray(res.data));

    console.log("Total books now:", res.data.length);
  } catch (err) {
    console.error("Books API error:", err.response?.data || err.message);
  }
});
