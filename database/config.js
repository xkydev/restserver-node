const mongoose = require('mongoose');


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Database connected');
    } catch (error) {
        // throw new Error('Error connecting to database');
        console.log(error);
    }
}


module.exports = {
    dbConnection
}