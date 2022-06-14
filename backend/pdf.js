const express = require("express");
const router = express.Router();
const noblox = require("noblox.js");
const db = require("./db/db");
const erouter = (usernames, pfps, settings, permissions, logging) => {
    const perms = permissions.perms;
    router.get('/all', async (req, res) => {
        let pdfs = await db.pdf.find({});
        const userPerms = await db.user.findOne({ userid: req.session.userid });
        let pdfsToSend = [];
        for (let i = 0; i < pdfs.length; i++) {
            const pdf = pdfs[i];
            if (
                pdf.permission.includes(userPerms.role) ||
                permissions.checkPerm(req.session.userid, "admin")
            ) {
                pdfsToSend.push(pdf);
            }
        }
        res.status(200).json({ pdfs: pdfsToSend });
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
    router.get('/ranks', async (req, res) => {
        const roles = await noblox.getRoles(Number(settings.get('group')));
        res.status(200).json({ roles: roles });
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
