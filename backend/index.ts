import app from "./app";

app.get("/", (_req, res) => {
    res.send("Hello from Express on Vercel!");
});

module.exports = app;