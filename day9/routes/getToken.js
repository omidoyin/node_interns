const express = require("express");
const jwtService = require("../services/JwtService"); // Adjust the path as needed

const router = express.Router();

// Route to generate a JWT token
router.post("/api/v1/token", (req, res) => {
  const { user_id, role_id, credential_id } = req.body;

  console.log(req.body);
  

  if (!user_id || !role_id || !credential_id) {
    return res.status(400).json({
      success: false,
      code: "BAD_REQUEST",
      message: "Missing required fields: user_id, role_id, credential_id.",
    });
  }

  // Create the payload for the token
  const payload = {
    user_id: user_id,
    role_id: role_id,
    credential_id: credential_id,
  };

  try {
    // Generate the JWT token
    const token = jwtService.createAccessToken(payload);
 

    // Respond with the token
    return res.status(200).json({
      success: true,
      token: token,
      message: "Token generated successfully.",
    });
  } catch (error) {
    // Handle any errors during token creation
    return res.status(500).json({
      success: false,
      code: "TOKEN_CREATION_FAILED",
      message: "Failed to generate token. Please try again later.",
    });
  }
});

module.exports = router;
