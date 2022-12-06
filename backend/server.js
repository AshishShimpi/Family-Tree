
const express = require('express');
const multer = require('multer');

const app = express();
const port = 3000;
const upload = multer();


app.get('', (req, res)=>{
    console.log('/addPerson \n');
    console.log(req);
    res.send('<h3>successs</h3>');
});

app.post('/addPerson',upload.any(),(req, res)=>{
    console.log('/addPerson \n');
    console.log(req);
    res.send('<h3>successs</h3>');
});

app.listen(port, ()=>{
    console.log('Server listening to port 3000');
});