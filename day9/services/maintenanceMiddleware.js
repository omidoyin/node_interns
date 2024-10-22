// maintenanceMiddleware.js
const config = {
  maintenance: false, // Set this flag based on your configuration
};

const maintenanceMiddleware = (req, res, next) => {
  if (config.maintenance) {
    return res.status(503).json({
      success: false,
      code: "SERVICE_UNAVAILABLE",
      message:
        "The service is currently under maintenance. Please try again later.",
    });
  }
  next();
};

module.exports = maintenanceMiddleware;
