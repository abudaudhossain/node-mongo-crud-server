const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const { json } = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// password: ARbujSXI6PR26ic6
//user: abudaud

const uri = "mongodb+srv://abudaud:ARbujSXI6PR26ic6@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

/* client.connect(err => {
  const collection = client.db("SDCompany").collection("employ");
  const user = {name: "Summon khan", email: "sumon@khan.com"};
  collection.insertOne(user);
//   console.log("data insert is success");
  // perform actions on the collection object
//   client.close();
}); */


async function run() {
    try {
        await client.connect();
        const database = client.db('foodMaster');
        const usersCollection = database.collection('users');

        //get api
        app.get('/users', async (req, res) =>{
            const users = await usersCollection.find({}).toArray();
           res.send(users);
        })

        app.get('/users/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.findOne(query);

            res.send(result)
        })
        
        // post api
        app.post('/users', async (req, res)=>{
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('Heating server',req.body)
            console.log(result, result)
            res.json(result);
        })

        //delete api
        app.delete('/users/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(query)

            res.json(result)
        } )

    } finally {
        // await client.close();
    }


}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Running my crud server");
})

app.listen(port, () => {
    console.log("listening Server on port: ", port)
})
