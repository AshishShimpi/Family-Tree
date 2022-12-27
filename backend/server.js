
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const client = require('./sanity');
const { getDB, connectToDB } = require('./db');
const fs = require('node:fs');


const app = express();
const port = 3111;
const upload = multer();
app.use(
    cors({
        origin: 'http://localhost:4200'
    })
);

let db

connectToDB((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Server listening to port ${port} `);
        });
        db = getDB();
        db.collection('Persons').find().toArray()
        .then(res => {
            console.log(typeof(parseInt(res[0].ji)));
        })
        .catch(err => {
            console.log(err);
        });
    }
})

app.post('/addPerson', upload.any(), (req, res) => {
    console.log('/addPerson \n', req.files[0].buffer);
    client.assets
        .upload('image', req.files[0])
        .then((document) => {
            console.log('The image was uploaded!', document)
        })
        .catch((error) => {
            console.error('Upload failed:', error.message)
        });

    res.status(200).send('succcesss');
});
