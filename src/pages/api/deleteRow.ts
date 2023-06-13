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
      const { id, rowIndex } = req.query;

      const result = await collection.updateOne(
        { _id: new ObjectId(id as string) },
        { $pull: { rows: { $position: parseInt(rowIndex as string) } } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Row deleted successfully' });
      } else {
        res.status(404).json({ message: 'Table or row not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete row' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}