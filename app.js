var express = require('express');
var Datastore = require('nedb-promise');
const path = require('path');

var app = express();
var linksdb = new Datastore({filename: "./dbs/links.db", autoload: true});

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');


app.get('/', async (req,res) => {
    let links = await linksdb.find({});
    res.render("index.ejs", {links});
});

app.get('/:link', async (req,res) => {
    let {link} = req.params;
    let record = await linksdb.find({link});

    if(!!record && !!record.url) res.redirect(record.url);
    else res.sendStatus(404);
});


app.listen(3000, () => {
    console.log("Listening on port 3000");
});