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
const { error } = require('console');
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

app.post('/signup', async (req, res) => {
    try {
        const data= req.body;

        const newData= new Data(data);

        const response= await newData.save();
        console.log('Data Saved');

        const payload= {
            id: response.id,
            email: response.email
        }
        console.log(JSON.stringify(payload));
        const token= generateToken(payload);
        console.log('Token is: '+ token);

        res.status(200).json({response: response, token: token});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

app.post('/login', async(req, res)=> {
    try {
        const {email, password}= req.body;

        const user= await Data.findOne({email: email})

        if(!user || !await user.comparePassword(password)){
            return res.status(401).json({error: 'Invalid Username or Password'})
        }

        const payload= {
            id: user.id,
            email: user.email
        }
        const token= generateToken(payload);
        res.json({token})

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
})



app.listen(port, ()=> console.log(`Server is working on port ${port}......`))