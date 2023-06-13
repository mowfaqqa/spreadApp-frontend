import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'DELETE') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('tables');
      const { id } = req.query;

      const result = await collection.deleteOne({ _id: new ObjectId(id as string) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Table deleted successfully' });
      } else {
        res.status(404).json({ message: 'Table not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete table' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}