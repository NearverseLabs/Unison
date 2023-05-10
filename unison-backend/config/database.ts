import mongoose, { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI: string = "mongodb://0.0.0.0:27017/unisonprod?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000";
    mongoose.set('strictQuery', false);
    await connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
