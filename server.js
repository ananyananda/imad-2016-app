var express = require('express');
var morgan = require('morgan');
var path = require('path');
var pool = require('pg').Pool;
var config = {
    user: 'ananyananda',
    database: 'ananyananda',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/profile', function(req, res){
    res.sendFile(path.join(__dirname, 'ui','Profile.html'));
});
app.get('/profile/add_article', function(req, res){
    res.sendFile(path.join(__dirname, 'ui','add_article.html'));
});
app.get('/profile/my_articles', function(req, res){
    res.sendFile(path.join(__dirname, 'ui','my_articles.html'));
});
app.get('/signup', function(req, res){
    res.sendFile(path.join(__dirname, 'ui','signup.html'));
});
app.get('/profile/add_article/post', function(req, res){
    res.sendFile(path.join(__dirname, 'ui','post.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/style1.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style1.css'));
});
app.get('/ui/style2.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style2.css'));
});
var pool = new pool(config);
app.get('/ananyananda-db', function (req, res) {
    pool.query('SELECT * FROM "user"', function(err,res) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send(JSON.stringify(result));
        }
    });
});

/*app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});*/




var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
