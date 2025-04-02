//  mongodb://localhost:27017


const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/gymBackend')
.then(() => console.log('DB connection successful!'))
.catch(err => console.error("MongoDB connection error:", err));
