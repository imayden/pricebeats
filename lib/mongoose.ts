import mongoose from 'mongoose';

let isConnected = false; // Tack connection status

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGODB_URI) {
        return console.log('MONGODB_URI is not defined');
    }

    if(isConnected) {
        console.log('=> using existing database connection');
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);

        let isConnected = true;

        console.log('MongoDB is connected');
    } catch (error) {
        console.log(error);
    }

}
