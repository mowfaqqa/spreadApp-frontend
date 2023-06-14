import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId, InsertOneResult } from 'mongodb';
import { connectToDatabase } from '../../../db';

interface Table {
  _id?: ObjectId;
  name: string;
  columns: string[];
  rows: string[][];
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { method } = req;

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('tables');

    if (method === 'GET') {
      const tables = await collection.find().toArray();
      res.status(200).json(tables);

    } else if (method === 'POST') {

      const newRowData = req.body.rows
      const newTable = req.body;
      const result: InsertOneResult<Table> = await collection.insertOne(newTable);
      const updatedRow = {...newTable, rows: newRowData}
      const insertedTable: Table = {
        _id: result.insertedId,
        ...updatedRow,
      };      
      res.status(201).json(insertedTable);
    } else if (method === 'PUT') {
      const { id } : any = req.query;
      const updatedTable = req.body;
      await collection.updateOne({ _id: new ObjectId(id) }, { $set: updatedTable });
      res.status(200).json(updatedTable);
    } else if (method === 'DELETE') {
      const { id } : any = req.query;
      await collection.deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Table deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling API request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}