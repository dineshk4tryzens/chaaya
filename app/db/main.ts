import { MongoClient, ServerApiVersion } from "mongodb";

// Replace the placeholder with your Atlas connection string
const uri = "mongodb+srv://ramnarayanan:Qwerty%401234@cluster0-ram.t24wt.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0-ram"
;

let client: unknown;
let clientPromise: unknown;

async function connectToMongo() {
  // Check if the client is already initialized
  if (client) {
    return client;
  }

  // If the client has not been initialized, set up the connection
  if (!clientPromise) {
    // Create a MongoClient with MongoClientOptions
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    console.log(
      "Pinged newwwwwwwwwwwwwww deployment. You successfully connected to MongoDB!"
    );
    // Initialize the client promise by connecting once
    clientPromise = (client as MongoClient).connect().then(() => client);
  }

  // Return the client promise
  return clientPromise;
}

// Use this function to interact with MongoDB
async function run() {
  try {
    const client = await connectToMongo();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

export default async function Connection() {
  return run().catch(console.dir).then((e) => e)
}
