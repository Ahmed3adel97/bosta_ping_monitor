const User = require('../models/User')

const register = async (req, res, next)=>{
    const {name, email, password} = req.body
    const newUser = new User({
        name,
        email,
        password
    })

    try{
        const user = await newUser.save()
        return res.send({user})
    }catch(e){
        next(e)
    }
}
module.exports = register;