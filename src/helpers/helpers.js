
const jwt=require('jsonwebtoken')
const errorshttps=require('http-errors')
const User= require('../modal/UserModal')

module.exports={
    signAccessTokenForRegisterEmail:(payloay)=>{
      return jwt.sign(payloay,process.env.tokenAcessRegisterEmail,{expiresIn:'1d'})
    },
    signAccesstokenId(id){
        return jwt.sign({id},process.env.tokenUserId,{expiresIn:'10d'})
    }
,
    verifyAccesstokenForClient:async (rq,rs,next)=>{
      const authHeader = rq.headers['authorization'];

         
       if(authHeader){
              const token=authHeader.split(' ')[1];
            
              if(!token){
                return next(errorshttps.Unauthorized()) 
            }
            try{
                const verified=jwt.verify(token,process.env.tokenUserId)
             
                const user=await User.findById(verified.id)
        
                
                 rq.userData=user
                next();
           }
           catch{
               rs.status(400).send("invalid Token")
           }
       }
       else{
              return next(errorshttps.Unauthorized()) 
       }
    }

}