const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running Successfully!!')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@cluster0.voxvdqi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {
    try {
        const taskCollections = client.db('taskMaster').collection('taskCollection')

        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollections.insertOne(task);
            res.send(result)
        })

        app.get('/tasks', async (req, res) => {
            const query = {};
            const tasks = await taskCollections.find(query).toArray();
            res.send(tasks);
        })
    }
    finally {

    }
}
run()