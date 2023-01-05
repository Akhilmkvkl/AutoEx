const jwt= require('jsonwebtoken')



const Auth=(req,res,next)=>{
    try {
         const token=req.header("Authorization")
         if(!token)
         return res.status(400).json({msg:"Invalid Authentication"})


         jwt.verify(token,process.env.Access_token_secret,(err,user)=>{
            if(err)
            return res.status(400).json({msg:"Invalid Authentication"})

            req.user=user
            next()
         })
    } catch (error) {
       return res.status(500).json({msg:error.message+"auth error anei"}) 
    }
}

module.exports=Auth