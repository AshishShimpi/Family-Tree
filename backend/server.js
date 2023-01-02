
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const client = require('./sanity');
const { getDB, connectToDB } = require('./db');
const fs = require('node:fs');

const app = express();
const port = 3111;
const upload = multer();
let db

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({
    extended: true
}));
app.use(
    cors({
        origin: 'http://localhost:4200'
    })
);

connectToDB((err) => {

    if (!err) {
        app.listen(port, () => {
            console.log(`Server listening to port ${port} `);
        });
        db = getDB();
    } else
        console.log('Database connection Error \n', err);
});

app.get('/getFamily', (req, res) => {

    let body = req.query;
    db.collection('Persons')
        .find({ accountId: body.accountId })
        .project({ _id: 0, id_img1: 0, id_img2: 0 })
        .sort({ level: -1 })
        .toArray()
        .then(resp => {
            res.status(200).json(resp);
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Document Fetch failed');
        });
});


app.post('/addPerson', upload.any(), (req, res) => addPerson(req, res));


async function addPerson(req, res) {
    let body = req.body;
    let image1URL, image2URL;
    let image1Id, image2Id;

    if (req.files.length === 0 || req.files === undefined)
        res.status(204).send('No Content');

    try {
        let image1 = await client.assets.upload('image', req.files[0].buffer);
        
        image1Id = await image1._id;
        image1URL = await image1.url;

        let image2 = await client.assets.upload('image', req.files[1].buffer);
        
        image2Id = await image2._id;
        image2URL = await image2.url;

        let personObject = {
            accountId: body.accountId,
            id: body.id,
            level: parseInt(body.level),
            name: body.name,
            spouse: body.spouse,
            location: body.location,
            dob: body.dob,
            address: body.address,
            parent: body.parent,
            id_img1: await image1Id,
            image1: await image1URL,
            id_img2: await image2Id,
            image2: await image2URL,
        };
        await db.collection("Persons").insertOne(personObject);

        res.status(201).json({
            image1: image1URL,
            image2: image2URL,
        });

    } catch (error) {
        console.error('AddPerson api failed:', error);
        res.status(500).send('AddPerson api failed');
    }
}

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
})
