// import { PrismaClient } from '@prisma/client';

import { MongoClient, ServerApiVersion } from "mongodb";
import { useEffect, useState } from "react";
import.meta.env
// /**
//  * @type PrismaClient
//  */
// let prisma;

// if (import.meta.env.NODE_ENV === 'production') {
//   prisma = new PrismaClient();
//   prisma.$connect();
// } else {
//   if (!global.__db) {
//     global.__db = new PrismaClient();
//     global.__db.$connect();
//   }
//   prisma = global.__db;
// }

// export { prisma };

// const { MongoClient, ServerApiVersion } = require('mongodb');
export async function MongoConnection() {
  const [connection, setConnection] = useState<MongoClient | undefined>(undefined);
  const uri = import.meta?.env?.DATABASE_URL;  // Ensure DATABASE_URL is set

  useEffect(() => {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    async function connectToMongo() {
      try {
        // Connect the client to the server
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("sample_mflix").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        setConnection(client);  // Set the Mongo client connection
      } catch (error) {
        console.error("Error connecting to MongoDB", error);
      }
    }

    connectToMongo();

    // Cleanup function to close the connection when component unmounts
    return () => {
      if (client) {
        client.close();
      }
    };
  }, [uri]);  // Run once when uri changes

  return connection;
}