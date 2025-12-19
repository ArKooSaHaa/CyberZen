import mongoose from "mongoose";

const connectDb = async () => {
    const uri = process.env.MONGO_URL;
    if (!uri) {
        console.log("MONGO_URL not set in environment. Skipping DB connection.");
        return;
    }

    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            // Use default options; Atlas SRV will be handled by the driver
            await mongoose.connect(uri);
            console.log("MongoDB Connected");
            return;
        } catch (error) {
            console.log(`MongoDB Connection attempt ${attempt} failed:`, error.message || error);
            if (attempt < maxAttempts) {
                const waitMs = Math.min(2000 * attempt, 15000);
                console.log(`Retrying MongoDB connection in ${waitMs}ms...`);
                // eslint-disable-next-line no-await-in-loop
                await new Promise((resolve) => setTimeout(resolve, waitMs));
            } else {
                console.log("All MongoDB connection attempts failed. Server will continue without DB.");
            }
        }
    }
};

export default connectDb;