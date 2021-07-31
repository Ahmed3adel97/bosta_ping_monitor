const express = require('express')
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const cron = require('node-cron');
const router = express.Router()
const app = express()
const register = require('./controller/register')
const createCheck = require('./controller/createCheck')
const login = require('./controller/login')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const check = require('./models/Check')
//-------- DB configration ----------------------
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });

  mongoose.connection.on('connected', () => {
    console.log('Connected to the database');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`Failed to connected to the database: ${err}`);
  });
  
//---------middleware ----------------------------
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


router.post('/post', authenticateToken, (req, res) => {  
    res.json({
      userId:req.userId,
      email:req.email
    })
  });

 
 router.post('/createCheck',authenticateToken, createCheck)

//  router.get('/geteCheck',authenticateToken,async (req, res, next)=>{
//         const checkks = await check.find({
//           email:"new@gmail.com"
//         })
//         res.send({checkks})
//  })

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  // console.log(token)
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACESSTOKENSECRET, (err, data) => {
    // console.log(data)
    if (err) return res.sendStatus(403)
    req.userId = data.user._id
    req.email = data.user.email
    next()
  })
}




router.post('/register', register)
router.post('/login', login)
app.use(router)


//-----------error handling ----------------

app.use((req, res, next) => {
    //404 Not Found
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const error = err.message || 'Error processing your request';
  
    res.status(status).send({
      error,
    });
  });

  console.log("cron")

  // cron.schedule('* * * * *', function() {
  //   console.log('running a task every minute');
  // });
   
module.exports = app