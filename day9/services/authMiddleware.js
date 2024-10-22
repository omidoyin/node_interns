const jwtService = require("./JwtService"); // Adjust the path as needed

const authMiddleware = (req, res, next) => {
  // Extract token from the request
  const token = jwtService.getToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "UNAUTHORIZED",
      message: "Access denied. No token provided.",
    });
  }

  // Verify the token
  const decoded = jwtService.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      code: "TOKEN_INVALID",
      message: "Invalid or expired token.",
    });
  }

  // Pass user information to the request object
  req.user_id = decoded.user_id;
  req.role = decoded.role_id;

  // Check if the API route includes a portal name and if the role matches the portal
  const portalName = req.params.portal; // Assuming the portal name is in the URL
  if (portalName && decoded.role_id !== portalName) {
    return res.status(403).json({
      success: false,
      code: "FORBIDDEN",
      message: `Access denied. Your role does not match the portal ${portalName}.`,
    });
  }

  // If everything is fine, proceed to the next middleware or route handler
  next();
};

module.exports = authMiddleware;
