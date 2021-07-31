const Monitor = require('ping-monitor');
const Check = require('../models/Check')
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.SENDEREmail,
        pass:process.env.SENDERPASS
    }
})


const pingChecks = async(email) =>{
    const checks = await Check.find({
        email
      })
      console.log(checks)
      checks.forEach(e => {
        const monitor = new Monitor({
            website: e.url,
            title: e.name,
            interval:1
        })

        monitor.on('up',function(res, state){
            
            const options = {
                from:process.env.SENDEREmail,
                to:monitor.website,
                title:monitor.title,
                text:`your check monitoring for${monitor.url} is up`
            }
            // console.log(monitor.title + " titlee")

            transporter.sendMail(options, (err, info) =>{
                if(err){
                    console.log(err)
                }else{
                    console.log("sent"+ info)
                }
            })
        })

        monitor.on('down',function(res, state){
            const options = {
                from:process.env.SENDEREmail,
                to:monitor.website,
                title:monitor.title,
                text:`your check monitoring for${monitor.url} is down`
            }
            console.log(options.to+" down")


            transporter.sendMail(options, (err, info) =>{
                if(err){
                    console.log(err)
                }else{
                    console.log("sent"+ info)
                }
            })
            console.log("down")
        })
      })

    }
exports.pingChecks = pingChecks;