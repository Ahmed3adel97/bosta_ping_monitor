const Check = require('../models/Check')
const createCheck = async (req, res, next) =>{
    const newCheck = new Check({
        userID: req.userId,
        url:req.body.url,
        name:req.body.name,
        email:req.email
    })

    try{
        const check = await newCheck.save()

        return res.send({check})

    }catch(e){
        next(e)
    }
}

module.exports = createCheck
