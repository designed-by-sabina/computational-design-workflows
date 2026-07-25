// ============================================================
// color-poll.js — "Favorite Color" live engagement component
// Reads + writes to Firebase Firestore, renders results as bubbles.
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot,
  serverTimestamp, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

// --- 1. Your Firebase config ---
const firebaseConfig = {
  apiKey: "AIzaSyDxg1l6vJaQ9fNv5mM9iMnDjq3ItPTZ0kE",
  authDomain: "favorite-color-4f696.firebaseapp.com",
  projectId: "favorite-color-4f696",
  storageBucket: "favorite-color-4f696.firebasestorage.app",
  messagingSenderId: "1038189466545",
  appId: "1:1038189466545:web:89f1412ebc360d3547e390"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const responsesRef = collection(db, "colorPollResponses");

// --- 2. DOM references ---
const form = document.getElementById("colorPollForm");
const input = document.getElementById("colorPollInput");
const statusEl = document.getElementById("colorPollStatus");
const bubbleContainer = document.getElementById("colorPollBubbles");

// --- 3. Helpers ---
function isValidCssColor(value) {
  const test = new Option();
  test.style.color = "";
  test.style.color = value;
  return test.style.color !== "";
}

function normalizeColor(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function submittedRecently() {
  const last = localStorage.getItem("colorPollLastSubmit");
  return last && Date.now() - Number(last) < 30000;
}

// Figures out if a color is "light" or "dark" so we know
// whether to put white or black text on top of it.
function getContrastTextColor(color) {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? "#111111" : "#ffffff";
}

// --- 4. Handle submission ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const color = normalizeColor(input.value);

  if (!isValidCssColor(color)) {