const jwt = require('jsonwebtoken');
const generateToken = (user) => {
  const payload = { userId: user.id, userName: user.username };
  const secretKey = '4012b5adf397d50459aebc1eb009e38b6b82256246bf2b64de300132dd3ef053'; 

  return jwt.sign(payload, secretKey);
};
const verifyToken = (token) => {
  const secretKey = '4012b5adf397d50459aebc1eb009e38b6b82256246bf2b64de300132dd3ef053'; 
  return jwt.verify(token, secretKey);
};

module.exports = { generateToken, verifyToken };
