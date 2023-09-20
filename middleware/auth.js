import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const secreteKey = process.env.SECRET_KEY;






export const generateAuthToken = (user)=>{

   const payload = {
     _id:user._id,
     name:user.name,
     email:user.email,
     phone:user.phone,
     location:user.location,
     isBanned:user.isBanned
   }
console.log(
  payload
);
   const token = jwt.sign({payload},secreteKey) 
   console.log(token);
   return token
}


export const authMiddleware = (req, res, next) => {
  console.log(secreteKey,'===================================9999');

  let token = req.header('Authorization');
  try {
    if (!token) return res.status(404).json({ message: 'Authorization Failed: no token provided' });

    if (token.startsWith('Bearer ')) {
      console.log('berer');
      token = token.slice(7,token.length).trimLeft(); // Fix the typo here from trimleft() to trimLeft()
   
      const verified = jwt.verify(token,secreteKey);
      console.log(verified);
      req.user = verified;
    }
   

    next();
  } catch (error) {
    return res.status(404).json({ message: 'Authorization Failed: invalid token' });
  }
};
