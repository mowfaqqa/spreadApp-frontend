import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('tables');
      const { id, rowIndex, columnIndex, value } = req.body;

      const result = await collection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { [`rows.${rowIndex}.cells.${columnIndex}`]: value } }
      );

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Cell updated successfully' });
      } else {
        res.status(404).json({ message: 'Table or cell not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to update cell' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}