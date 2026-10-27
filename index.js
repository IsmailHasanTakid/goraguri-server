import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function run() {
    const db = client.db("tourist-db");
    const destinations = db.collection("destination");
    const bookingCollection = db.collection("bookings");
    const users = db.collection("user");
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

    app.post("/users", async (req, res) => {
        const { name, email, password } = req.body;
        const result = await users.insertOne({ name, email, password });
        res.send(result);
    })

    app.get("/users", async (req, res) => {
        const result = await users.find().toArray();
        res.send(result);
    })


    app.post("/booking", async (req, res) => {
        const data = req.body
        const result = await bookingCollection.insertOne(data)
        res.send(result)

    })

    app.get('/my-bookings/:email', async (req, res) => {
        const { email } = req.params
        const result = await bookingCollection.find({ email: email }).toArray()
        res.send(result)

    })

    app.delete("/my-bookings/:id", async (req, res) => {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: "Invalid booking ID" });
            }

            const result = await bookingCollection.deleteOne({
                _id: new ObjectId(id),
            });

            if (result.deletedCount === 0) {
                return res.status(404).send({ message: "Booking not found" });
            }

            res.send({ message: "Booking cancelled successfully" });
        } catch (error) {
            res.status(500).send({ message: "Failed to cancel booking" });
        }
    });


    console.log('MongoDB connected');
}

run();

app.get('/', (req, res) => res.send('server is running fine'));
app.listen(5000, () => console.log('Server running on port 5000'));