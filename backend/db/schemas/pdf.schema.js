const mongoose = require('mongoose');

const pdf = new mongoose.Schema({
    name: String,
    enabled: Boolean,
    permission: String,
    url: String,
})

    module.exports = mongoose.models['pdfs'] || mongoose.model('pdfs', pdf, 'pdfs');