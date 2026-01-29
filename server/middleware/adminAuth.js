import jwt from 'jsonwebtoken'

// const adminAuth = async (req, res, next) => {
//     try {
//         const {token} = req.headers
//         if(!token){
//             return res.json({succcess:false, message:"Not Authorized Login Again"})
//         }
//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
//             return res.json({success:false, message:"Not Authorized Login Again"})
//         }
//         next()
//     } catch (error) {
//         console.log(error)
//         res.json({success:false, message: error.message})
//     }
// }

const adminAuth = (req, res, next) => {
  try {
    const token =
      req.headers.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Admin Token Missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // if (decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
    if(!decoded.isAdmin){
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default adminAuth;