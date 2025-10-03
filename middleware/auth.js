module.exports = function (req, res, next) {
  if (!req.session.loggedin) {
    return res.status(404).render("404", {
      title: "404 - Page Not Found",
      message: "Page not found",
    });
  }
  next();
};