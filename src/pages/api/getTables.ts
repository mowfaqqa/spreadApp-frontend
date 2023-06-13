import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const db = await connectToDatabase();
      const collection = db.collection('tables');
      
      const tables = await collection.find().toArray();

      res.status(200).json({ tables });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tables' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}