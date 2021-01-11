var express = require('express');
var app = express();

app.get('/:link',(req,res) => {
    
    res.redirect('/');
});

app.use('/',express.static('/public'));


app.listen(3000, () => {
    console.log("Listening on port 3000");
});