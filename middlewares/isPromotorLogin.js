const Promotor = require('../models/Promotor')
const jwt = require('jsonwebtoken')

function isPromotorLogin(req,res,next){
  let token = req.headers.token
  jwt.verify(token,process.env.JWT_SECRET, function(error, decoded){
    if(error){ //tidak bisa verify jwt (token yg dikirim null)
      res.status(401).send({message: 'please login'})
    } else {
      Promotor.findOne({
        email: decoded.email
      })
      .then(promotor => {
        if(promotor){
          req.current_promotor = promotor
          next()
        } else {
          // console.log('user not found')
          res.status(401).send({message: 'please login'})  
        }
        
      })
      .catch( error =>{
        // console.log(error)
        res.status(400).send({message: error.message})
      })
    }
  })
}

module.exports = isPromotorLogin