const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

const openaiApiKey = defineSecret("OPENAI_API_KEY");

const RATE_LIMIT_MAX_REQUESTS = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// Proxies chat completion requests to OpenAI so the API key
// never ships to the browser. Called by javascript/palette-assistant.js.
// No login required — abuse is mitigated with per-IP rate limiting instead.
exports.callOpenAI = onRequest(
    { secrets: [openaiApiKey], cors: true },
    async (req, res) => {

        if (req.method !== "POST") {
            res.status(405).send("Method not allowed");
            return;
        }

        if (!req.body || !Array.isArray(req.body.messages)) {
            res.status(400).json({
                error: "Request body must include a 'messages' array."
            });
            return;
        }

        const clientIp = getClientIp(req);

        try {

            const allowed = await checkRateLimit(clientIp);

            if (!allowed) {
                res.status(429).json({
                    error: "Rate limit exceeded. Please try again later."
                });
                return;
            }

        } catch (error) {

            // A Firestore hiccup shouldn't take the whole feature down.
            console.error("Rate limit check failed:", error);

        }

        let openaiResponse;

        try {

            openaiResponse = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${openaiApiKey.value()}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        response_format: { type: "json_object" },
                        messages: req.body.messages
                    })
                }
            );

        } catch (error) {

            console.error("OpenAI request failed:", error);

            res.status(502).json({
                error: "Failed to reach OpenAI."
            });

            return;

        }

        const data = await openaiResponse.json();

        logRequest(clientIp, openaiResponse.ok).catch((error) =>
            console.error("Could not log request:", error)
        );

        res.status(openaiResponse.status).json(data);

    }
);


function getClientIp(req) {

    const forwardedFor = req.headers["x-forwarded-for"];

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    return req.ip || "unknown";

}


// Sliding-window rate limit: at most RATE_LIMIT_MAX_REQUESTS
// per IP within RATE_LIMIT_WINDOW_MS.
async function checkRateLimit(clientIp) {

    const windowStart = Date.now() - RATE_LIMIT_WINDOW_MS;

    const ref = db.collection("openaiRateLimits").doc(clientIp);

    const snapshot = await ref.get();

    const recentTimestamps =
        (snapshot.exists ? snapshot.data().timestamps : [])
            .filter((timestamp) => timestamp > windowStart);

    if (recentTimestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
        return false;
    }

    recentTimestamps.push(Date.now());

    await ref.set({ timestamps: recentTimestamps });

    return true;

}


async function logRequest(clientIp, success) {

    await db.collection("openaiRequestLogs").add({
        ip: clientIp,
        success,
        createdAt: FieldValue.serverTimestamp()
    });

}
