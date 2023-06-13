import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://muwaffaq:Donfaqzy1976@spreadsheetcluster.lrnylpv.mongodb.net/spreadApp";
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to mongoDB');
    return client.db();

  } catch (error) {
     console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}