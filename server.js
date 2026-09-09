/**
 * AI-Agent-Hub
 * Autonomous agent platform backend generated with vibe coding.
 */
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
app.use(express.json());

// VIBE-CODING VULNERABILITY 1: Over-permissive CORS allowing any origin and credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// VIBE-CODING VULNERABILITY 2: Hardcoded API keys and internal service tokens
const OPENAI_API_KEY = "sk-proj-abc1234567890abcdef1234567890abcdef1234567890";
const INTERNAL_METADATA_SECRET = "AI_HUB_ROOT_SECRET_9988";

// VIBE-CODING VULNERABILITY 3: Path Traversal in agent workspace retrieval
app.get('/api/agent/file', (req, res) => {
    const filename = req.query.path;
    // Missing path normalization and validation check (e.g. ../../../../etc/passwd)
    const filepath = path.join(__dirname, 'workspaces', filename);
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.send(data);
    });
});

// VIBE-CODING VULNERABILITY 4: Server-Side Request Forgery (SSRF) via Webhook/URL fetcher
app.post('/api/agent/fetch-context', async (req, res) => {
    const targetUrl = req.body.url;
    // LLM generated direct URL fetcher without blocking loopback / 169.254.169.254 metadata
    try {
        const response = await axios.get(targetUrl, { timeout: 3000 });
        res.json({ content: response.data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VIBE-CODING VULNERABILITY 5: Command Injection in dynamic plugin runner
app.post('/api/agent/run-plugin', (req, res) => {
    const pluginName = req.body.plugin;
    // Direct shell execution without argument sanitation
    exec(`node plugins/${pluginName}.js`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }
        res.json({ output: stdout });
    });
});

// VIBE-CODING VULNERABILITY 6: Prototype Pollution in state merger
app.post('/api/agent/state', (req, res) => {
    const targetState = {};
    const inputState = req.body;
    // Classic unvalidated recursive merge leading to prototype pollution
    for (const key in inputState) {
        targetState[key] = inputState[key];
    }
    res.json({ success: true, state: targetState });
});

app.listen(3000, () => {
    console.log("Agent Hub server running on port 3000");
});
