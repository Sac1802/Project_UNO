export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something broke!';

  res.status(statusCode).json({ error: message });
};



export const notFoundHandler = (req, res) => {
  res.status(404).send('Not Found');
};
