const express = require("express");
const router = express.Router();
const db = require("./db/db");
const erouter = (usernames, pfps, settings, permissions, logging) => {
    const perms = permissions.perms;
    router.get('/all', async (req, res) => {
        let pdfs = await db.pdf.find({});
        res.status(200).json({ pdfs: pdfs });
    })
    router.post('/add', perms("admin"), async (req, res) => {
        const { name, enabled, permission, url, description } = req.body;
        console.log(req.body)
        if (!name || !url || !permission || !enabled || !description) 
            return res.status(400).json({ error: "No name, url, permission, or enabled provided." });
        await db.pdf.create({
            name: name,
            enabled: enabled,
            permission: permission,
            url: url,
            description: description
        });
        res.status(200).json({ success: true });
    })
    router.post('/delete', perms("admin"), async (req, res) => {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "No name provided." });
        await db.pdf.deleteOne({ name: name });
        res.status(200).json({ success: true });
    })
    return router
}

module.exports = erouter;
