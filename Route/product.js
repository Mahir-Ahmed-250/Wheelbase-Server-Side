const express = require("express");
const router = express.Router();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnlpi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    await client.connect();
    console.log('DATABASE CONNECTED SUCCESSFULLY');
    const database = client.db('WheelBase')
    const productCollection = database.collection('products')
    // GET All Products API
    app.get('/products', async (req, res) => {
        const cursor = productCollection.find({})
        const products = await cursor.toArray()
        res.send(products)
    })
}
module.exports = router;