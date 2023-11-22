const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Replace the connection string with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://anuragr135:fwylbqBMIlwhPoHa@cluster0.8bnfrhw.mongodb.net/';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Assuming your HTML file is in the 'public' folder

app.post('/submitData', (req, res) => {
    const { name, email } = req.body;

    MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error connecting to the database');
        }

        const db = client.db('nunu'); // Replace 'your-database-name' with your database name
        const collection = db.collection('users'); // Replace 'users' with your collection name

        // Insert data into the collection
        collection.insertOne({ name, email }, (insertErr, result) => {
            if (insertErr) {
                console.error(insertErr);
                client.close();
                return res.status(500).send('Error inserting data into the database');
            }

            client.close();
            res.send('Data inserted successfully');
        });
    });
});

app.post('/searchData', (req, res) => {
    const { searchName } = req.body;

    MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error connecting to the database');
        }

        const db = client.db('nunu'); // Replace 'your-database-name' with your database name
        const collection = db.collection('users'); // Replace 'users' with your collection name

        // Search for data in the collection
        collection.find({ name: searchName }).toArray((findErr, result) => {
            if (findErr) {
                console.error(findErr);
                client.close();
                return res.status(500).send('Error searching data in the database');
            }

            client.close();
            res.send(result);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
