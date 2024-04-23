const jwt = require("jsonwebtoken");

const generateSign = (id, username, role) => {
  return jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};

const verifyJwt = (token, next) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(err); // Pasar el error al siguiente middleware
  }
};

const generateTempToken = (id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: "1h",
  })
}
module.exports = { generateSign, verifyJwt, generateTempToken };
