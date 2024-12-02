const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

// initialize mongoDB connection
main()
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(URI);
}

module.exports = main;