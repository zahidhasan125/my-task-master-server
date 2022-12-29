const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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

        app.patch('/tasks', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    isCompleted: true
                }
            }
            const result = await taskCollections.updateOne(filter, updateDoc, option)
            res.send(result);
        })
        app.delete('/tasks', async (req, res) => {
            const id = req.query.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollections.deleteOne(query);
            res.send(result)
        })

        app.patch('/edittask', async (req, res) => {
            const id = req.query.id;
            const name = req.query.editTask;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    taskName: name
                }
            }
            const result = await taskCollections.updateOne(filter, updateDoc, option);
            res.send(result);
            console.log(id, name);
        })

        app.get('/completed', async (req, res) => {
            const query = { isCompleted: true };
            const completed = await taskCollections.find(query).toArray();
            res.send(completed);
        })

        app.patch('/completed', async (req, res) => {
            const id = req.query.id;
            const filter = { _id: ObjectId(id) }
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    isCompleted: false
                }
            }
            const result = await taskCollections.updateOne(filter, updateDoc, option)
            res.send(result);
        })

    }
    finally {

    }
}
run()