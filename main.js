const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const port = 2079;

const serviceAccount = require('./project-k-f9e40-firebase-adminsdk-wfiv4-566faafc04.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home Page</title>
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
            }
            header {
                background-color: #444;
                color: #f0f0f0;
                padding: 20px;
                text-align: center;
            }
            main {
                padding: 20px;
            }
            .hero {
                text-align: center;
                margin-top: 50px;
            }
            .hero h2 {
                font-size: 2em;
                margin-bottom: 10px;
            }
            .hero p {
                font-size: 1.2em;
                margin-bottom: 20px;
            }
            .btn {
                display: inline-block;
                background-color: #ff5733;
                color: #f0f0f0;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
            .btn:hover {
                background-color: #c70039;
            }
            footer {
                background-color: #444;
                color: #f0f0f0;
                padding: 10px 20px;
                text-align: center;
                position: fixed;
                bottom: 0;
                width: 100%;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>Welcome to Our Website</h1>
        </header>
        <main>
            <section class="hero">
                <h2>We Make Your Life Easier</h2>
                <p>Explore our services and simplify your tasks.</p>
                <form action="/login">
                    <button class="btn">Log In</button>
                </form>
            </section>
        </main>
        <footer>
            <p>&copy; 2024 Our Website. All rights reserved.</p>
        </footer>
    </body>
    </html>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Log In</title>
        <style>
            body {
                padding-top: 80px;
                background-color: #f8f8f8;
            }
            .container {
                margin-top: 50px;
            }
            .col-sm-6 {
                background-color: #fff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
            }
            h1 {
                text-align: center;
                margin-bottom: 30px;
            }
            .fa-sign-in {
                color: #ff5733;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                font-weight: bold;
            }
            .btn-lg {
                width: 100%;
            }
            .btn-warning {
                background-color: #ff5733;
                border-color: #ff5733;
            }
            .btn-warning:hover,
            .btn-warning:focus {
                background-color: #c70039;
                border-color: #c70039;
            }
            p {
                text-align: center;
                margin-top: 15px;
            }
            a {
                color: #ff5733;
            }
            a:hover {
                color: #c70039;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="col-sm-6 col-sm-offset-3">
                <h1><span class="fa fa-sign-in"></span> Login</h1>
                <!-- LOGIN FORM -->
                <form action="/login" method="POST">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" class="form-control" name="email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" name="password">
                    </div>
                    <button type="submit" class="btn btn-warning btn-lg">Login</button>
                </form>
                <hr>
                <p>Need an account? <a href="/signup">Signup</a></p>
                <p>Or go <a href="/">home</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
        console.log('No such user!');
        res.redirect('/login');
    } else {
        let validUser = false;
        snapshot.forEach(doc => {
            if (doc.data().password === password) {
                validUser = true;
            }
        });

        if (validUser) {
            console.log(`User ${email} logged in successfully`);
            res.sendFile(path.join(__dirname, 'web.html'));
        } else {
            console.log('Incorrect password');
            res.redirect('/login');
        }
    }
});

app.get('/signup', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Sign UP</title>
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.min.css">
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css">
        <style>
            body { padding-top: 80px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="col-sm-6 col-sm-offset-3">
                <h1><span class="fa fa-sign-in"></span> Signup</h1>
                <!-- SIGNUP FORM -->
                <form action="/signup" method="POST">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="text" class="form-control" name="email">
                    </div>
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" class="form-control" name="username">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" class="form-control" name="password">
                    </div>
                    <button type="submit" class="btn btn-warning btn-lg">Signup</button>
                </form>
                <hr>
                <p>Already have an account? <a href="/login">Login</a></p>
                <p>Or go <a href="/">home</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;
    const userRef = db.collection('users').doc(username);
    const doc = await userRef.get();

    if (doc.exists) {
        console.log('Username already exists');
        res.status(400).send('Username already exists');
    } else {
        await userRef.set({
            email,
            password,
        });
        console.log('User registered');
        res.status(200).send('User registered');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
