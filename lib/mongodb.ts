import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

const uri = process.env.MONGO_URI;

// Optimized connection options for better performance
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 60000, // Close idle connections after 60s
  serverSelectionTimeoutMS: 10000, // Increased timeout for SSL handshake
  socketTimeoutMS: 45000,
  connectTimeoutMS: 15000, // Increased timeout for initial connection
  retryWrites: true,
  retryReads: true,
  // Removed compressors to avoid SSL conflicts
  tls: true, // Enable TLS
  tlsAllowInvalidCertificates: false, // Validate certificates in production
  tlsAllowInvalidHostnames: false,
  directConnection: false, // Use replica set
  family: 4, // Force IPv4 to avoid potential IPv6 issues
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// You can specify the database name when performing operations
export const dbName = "Practice";
export default clientPromise;