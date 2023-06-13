import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('tables');
      const { name, columns } = req.body;

      const table = {
        name,
        columns,
        rows: [],
      };

      const result = await collection.insertOne(table);

      res.status(201).json({ message: 'Table created successfully', id: result.insertedId });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create table' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}