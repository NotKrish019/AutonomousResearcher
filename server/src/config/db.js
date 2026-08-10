import mongoose from 'mongoose';

export const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/autonomous_researcher';
  try {
    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection Notice: ${error.message}`);
    console.warn(`[MongoDB] Proceeding with in-memory state persistence fallback for active session.`);
    return false;
  }
};
