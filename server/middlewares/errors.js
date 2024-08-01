const notFoundHandler = (req, res, next) => {
  res.status(404).render("pages/clients/errors/404.njk");
};

module.exports = notFoundHandler;
