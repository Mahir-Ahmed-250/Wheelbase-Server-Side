const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnlpi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('DATABASE CONNECTED SUCCESSFULLY');

        const database = client.db('WheelBase')
        const productCollection = database.collection('products')
        const testingCollection = database.collection('testing')
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');
        const userCollection = database.collection('users');
        // GET All Products API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const products = await cursor.toArray()
            res.send(products)
        })

        app.get('/naturals', async (req, res) => {
            const result = await toolCollection.find().toArray();
            res.json(result);
        })

        // GET Single Product API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.json(product)
        })

        // POST An Product API
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result)
        })

        // DELETE Product API
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.json(result)
        })

        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })

        // GET Orders API
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        //UPDATE Order Status
        app.put('/users/approve', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { Email: user.Email, Status: user.Status };
            const updateDoc = { $set: { Status: 'Shipped' } };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result);
            console.log(result)
        })

        // DELETE Orders API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

        // POST A Review API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })
        // GET All Reviews API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({})
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        // ADD An User API
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user);
            res.json(result)
        })

        // UPDATE/Store An User API(google)
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        // CHECK Admin API
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'Admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        // UPDATE An User To Admin API
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'Admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
            console.log(result)
        })
    }
    finally {

    }
}

run().catch(console.dir)



app.get('/', (req, res) => {
    res.send('Running Server')
});
app.listen(port, () => {
    console.log('SERVER RUNNING AT', port)
})