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
    statusEl.textContent = "That doesn't look like a color — try 'coral' or '#ff6b6b'.";
    return;
  }
  if (submittedRecently()) {
    statusEl.textContent = "You already submitted — thanks! Watch the bubbles update.";
    return;
  }

  try {
    await addDoc(responsesRef, { color, createdAt: serverTimestamp() });
    localStorage.setItem("colorPollLastSubmit", Date.now().toString());
    statusEl.textContent = "Added to the bubbles below!";
    form.reset();
  } catch (err) {
    console.error("Error submitting color:", err);
    statusEl.textContent = "Something went wrong — try again.";
  }
});

// --- 5. Live aggregation + bubble rendering ---
const recentQuery = query(responsesRef, orderBy("createdAt", "desc"), limit(500));

onSnapshot(recentQuery, (snapshot) => {
  const counts = {};
  snapshot.forEach((doc) => {
    const c = doc.data().color;
    if (c) counts[c] = (counts[c] || 0) + 1;
  });
  renderBubbles(counts);
});

function renderBubbles(counts) {
  bubbleContainer.innerHTML = "";
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    bubbleContainer.innerHTML = "<p class='color-poll-empty'>No colors yet — be the first!</p>";
    return;
  }

  const maxCount = Math.max(...entries.map(([, c]) => c));
  entries.forEach(([color, count], i) => {
    const bubble = document.createElement("div");
    bubble.className = "color-poll-bubble";
    const size = 60 + (180 - 60) * (count / maxCount);
    const textColor = getContrastTextColor(color);

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = color;
    bubble.style.color = textColor;
    bubble.style.animationDelay = `${i * 0.3}s`;

    bubble.innerHTML = `<span class="count">${count}</span><span class="label">${color}</span>`;
    bubbleContainer.appendChild(bubble);
  });
}

