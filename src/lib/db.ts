// MongoDB client configuration for Auth.js and Mongoose
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let mongooseConnection: Promise<typeof mongoose> | null = null;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
    _mongooseConnection?: Promise<typeof mongoose>;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;

  if (!globalWithMongo._mongooseConnection) {
    globalWithMongo._mongooseConnection = mongoose.connect(uri);
  }
  mongooseConnection = globalWithMongo._mongooseConnection;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  mongooseConnection = mongoose.connect(uri);
}

// Export both the MongoClient (for Auth.js) and Mongoose connection
export default client;
export const cachedMongooseConnection = mongooseConnection;
