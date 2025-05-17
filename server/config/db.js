const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connection successful!");
    } catch (err) {
        console.log("DB connection failed:");
        process.exit(1);
    }
}

module.exports = dbConnection;