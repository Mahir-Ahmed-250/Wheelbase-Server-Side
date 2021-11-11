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
        const orderCollection = database.collection('orders');

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const products = await cursor.toArray()
            res.send(products)
        })


        // GET Single Product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.findOne(query);
            res.json(product)
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
        // DELETE Orders API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result)
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