const User = require('../models/User')
const Check = require('../models/Check')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const ping = require('../monitor/ping')
const login = async (req, res, next) =>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email})
        //check if the user exist
        if(!user){
            const err = new Error("this user not in out system")
            err.status = 401
            next(err)
        }
        // check if the password correct by comparing with the hashed password
        bcrypt.compare(password, user.password, (err, data) =>{
            if (err) throw err
            if (data) {
                const token = jwt.sign({user}, process.env.ACESSTOKENSECRET)
                return res.status(200).json({ token })
            } else {
                return res.status(401).json({ msg: "Invalid credencial" })
            }  
        })

        //staart the ping process 
        console.log(email)
        const checks = ping.pingChecks(email)

        
    }catch(e){
        next(e)
    }
}



module.exports = login