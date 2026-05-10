function healthCheck(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'AI Service Desk backend is healthy',
  });
}

module.exports = {
  healthCheck,
};
