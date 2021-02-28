var express = require('express');
var Datastore = require('nedb-promise');
const path = require('path');

var app = express();
var linksdb = new Datastore({filename: "./dbs/links.db", autoload: true});
var usedb = new Datastore({filename: "./dbs/use.db", autoload: true});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');


app.get('/', async (req,res) => {
    let links = await linksdb.find({});
    res.render("index.ejs", {links});
});

app.get('/admin', async (req,res) => {
    let links = await linksdb.find({});
    res.render("admin.ejs", {links});
});

app.get('/edit/:_id', async (req,res) => {
    let {_id} = req.params;
    let link = await linksdb.findOne({_id});
    res.render("edit", {link});
});

app.post('/update/:_id', async (req,res) => {
    let {_id} = req.params;
    linksdb.update({_id}, req.body).then(results => {
        res.redirect('/admin');
    }).catch(e => {
        res.status(500).send("There was an error!");
    });
})

app.get('/add', async (req,res) => {
    res.render("add.ejs");
});


//ToDo Implement this
app.delete('/links/:_id', async (req,res) => {
    let {_id} = req.params;
    linksdb.remove({_id}).then(() => {
        res.redirect('/admin');
    }).catch(e => {
        res.status(500).send("There was an error!");
    });
});

app.post('/link', async (req,res) => {
    let {name, url, description, link} = req.body;
    linksdb.insert({name, url, link, description, created: new Date()}).then(() => {
        res.redirect('/admin');
    }).catch(e => {
        res.status(500).send("There was an error!");
    });
});

app.get('/:link', async (req,res) => {
    let {link} = req.params;
    let record = await linksdb.findOne({link});
    if(!!record && !!record.url) {
        usedb.insert({link, date: new Date()});
        res.redirect(301,record.url);
    }
    else res.sendStatus(404);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});