const mongoose = require('mongoose');

const mquestion = new mongoose.Schema({
    question: String,
    a1: String,
    a2: String,
    a3: String,
    answer: String,
})

const tquestion = new mongoose.Schema({
    question: String,
})

const applucation = new mongoose.Schema({
    name: String,
    enabled: Boolean,
    textQuestions: [tquestion],
    choiceQuestions: [mquestion],
    ranks: [String],
})

module.exports = mongoose.models['applications'] || mongoose.model('applications', applucation, 'applications');