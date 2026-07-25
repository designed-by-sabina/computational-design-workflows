<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDxg1l6vJaQ9fNv5mM9iMnDjq3ItPTZ0kE",
    authDomain: "favorite-color-4f696.firebaseapp.com",
    projectId: "favorite-color-4f696",
    storageBucket: "favorite-color-4f696.firebasestorage.app",
    messagingSenderId: "1038189466545",
    appId: "1:1038189466545:web:89f1412ebc360d3547e390",
    measurementId: "G-TB3ZG3WV9R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>


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
  return value.trim().toLowerCase();
}
function submittedRecently() {
  const last = localStorage.getItem("colorPollLastSubmit");
  return last && Date.now() - Number(last) < 30000; // 30s cooldown
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
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.background = color;
    bubble.style.animationDelay = `${i * 0.3}s`;
    bubble.innerHTML = `<span class="count">${count}</span><span class="label">${color}</span>`;
    bubbleContainer.appendChild(bubble);
  });
}





