import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId, InsertOneResult } from 'mongodb';
import { connectToDatabase } from '../../../db';

interface Table {
  _id?: ObjectId;
  name: string;
  columns: string[];
  rows: string[][];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Table[] | Table | { message: string }>
) {
  const db = await connectToDatabase();
  const collection = db.collection<Table>('tables');

  if (req.method === 'GET') {
    // Fetch all tables from the database
    const tables = await collection.find().toArray();
    res.status(200).json(tables);
  } else if (req.method === 'POST') {
    // Create a new table and save it to the database
    const { name, columns, rows } = req.body;
    const newTable: Table = { name, columns, rows };
    const result: InsertOneResult<Table> = await collection.insertOne(newTable);
    const insertedTable: Table = {
      _id: result.insertedId,
      ...newTable,
    };
    res.status(201).json(insertedTable);
  } else if (req.method === 'DELETE') {
    // Delete a table from the database
    const { id } = req.query;
    await collection.deleteOne({ _id: new ObjectId(id as string) });
    res.status(200).json({ message: 'Table deleted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}