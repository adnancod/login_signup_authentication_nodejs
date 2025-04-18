const express= require('express');
const app= express();
const db= require('./db')
const data= require('./data')
const passport= require('./auth')
const {jwtAuthMiddleware, generateToken}= require('./jwt');
const cors= require('cors');
app.use(cors());
app.use(express.json());


const bodyParser= require('body-parser');
const Data = require('./data');
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

const logRequest= (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Request made to: ${req.originalUrl}`);
    next();
}
app.use(logRequest);

app.use(passport.initialize());

const localAuthMiddleware= passport.authenticate('local', {session: false});

app.get('/', jwtAuthMiddleware, (req, res)=>{
        res.send('Welcome to database')
})

const myRoutes= require('./Routes/routes')

app.use('/', myRoutes)

app.listen(port, ()=> console.log(`Server is working on port ${port}......`))