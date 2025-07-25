export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

export const notFoundHandler = (req, res) => {
  res.status(404).send('Not Found');
};
