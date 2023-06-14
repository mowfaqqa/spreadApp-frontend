import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://muwaffaq:Donfaqzy1976@spreadsheetcluster.lrnylpv.mongodb.net/spreadApp";
const options = { useNewUrlParser: true, useUnifiedTopology: true };


export async function connectToDatabase() {

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    return { client, db };

  } catch (error) {
     console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}