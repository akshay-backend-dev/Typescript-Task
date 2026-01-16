// This file is of socket client for backend implementation
// To run socket backend use command: node socket-test.js

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

const { io } = require("socket.io-client");
const axios = require("axios");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error("ADMIN_TOKEN missing");
  process.exit(1);
}

const socket = io("http://localhost:2209", {
  auth: { token: ADMIN_TOKEN },
});

socket.onAny((event) => {
  console.log("🟢 Event received:", event);
});

socket.on("connect", () => {
  console.log("☑️  Admin socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("⚠️  Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.log("❌  Socket disconnected:", reason);
});


// User socket events -

// User signed in
socket.on("user:signed-up", async (data) => {
  console.log("User Signed up:", data);

  try {
    const res = await axios.get("http://localhost:2209/api/users", {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log("Total users now:", res.data.totalUsers);
  } catch (err) {
    console.error("Users API error:", err.response?.data || err.message);
  }
});

// User logged in
socket.on("user:logged-in", async (data) => {
  console.log("User logged in:", data);
});


// Book socket events -

// Book added
socket.on("book:added", async (data) => {
  console.log("Book added:", data);

  try {
    const res = await axios.get("http://localhost:2209/api/books", {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    });

    console.log("Total books now:", res.data.length);
  } catch (err) {
    console.error("Books API error:", err.response?.data || err.message);
  }
});