import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db';
import { ObjectId } from 'mongodb';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('tables');
      const { id, column } = req.body;

      const result = await collection.updateOne(
        { _id: new ObjectId(id as string) },
        { $push: { columns: column } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Column added successfully' });
      } else {
        res.status(404).json({ message: 'Table not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to add column' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}