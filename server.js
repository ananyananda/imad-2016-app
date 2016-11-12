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
function hash(input,salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}
app.post('/signup', function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1, $2)', [username, dbString], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            res.send('User successfully created: ' +username);
        }
    });
});
app.post('/login', function(req,res) {
    var username = req.body.username;
    var password = req.body.password;
    
    var dbString = hash(password, salt);
    pool.query('SELECT * FROM "user" WHERE username=$1', [username], function(err,result) {
        if(err) {
            res.status(500).send(err.toString());
        }
        else {
            if (result.rows.length === 0) {
                res.send(403).send('username/password is invalid');
            } else {
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password, salt);
                if(hashedPassword === dbString) {
                    res.send('Credentials correct!');
                    } else {
                        res.send(403).send('username/password is invalid');
                    }
            }
            
        }
    });
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
