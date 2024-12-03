require('dotenv').config();
const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

async function main() {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

main();

module.exports = main;
