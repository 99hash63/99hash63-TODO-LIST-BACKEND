const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    timestamp: {type: Date, required: true},
    color: {type: String, required: true},
    completed: {type: Boolean, required: true},
    priority: {type: String, required: true}
});

const Todo = mongoose.model("todo", todoSchema);

module.exports = Todo;


