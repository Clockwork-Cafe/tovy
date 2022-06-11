const mongoose = require('mongoose');

const applucation = new mongoose.Schema({
    name: String,
    enabled: Boolean,
})

module.exports = mongoose.models['applications'] || mongoose.model('applications', applucation, 'applications');