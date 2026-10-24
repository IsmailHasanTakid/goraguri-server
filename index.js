import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function run() {
    await client.connect();
    const destinations = client.db('tourist-db').collection('user');

    // ডেটা যোগ
    app.post('/destinations', async (req, res) => {
        const result = await destinations.insertOne(req.body);
        res.send(result);
    });

    // সব ডেটা
    app.get('/destinations', async (req, res) => {
        const result = await destinations.find().toArray();
        res.send(result);
    });

    // একটা ডেটা
    app.get('/destinations/:id', async (req, res) => {
        const id = req.params.id;
        const result = await destinations.findOne({ _id: new ObjectId(id) });
        res.send(result);
    });

    console.log('MongoDB connected');
}

run();

app.get('/', (req, res) => res.send('server is running fine'));
app.listen(5000, () => console.log('Server running on port 5000'));