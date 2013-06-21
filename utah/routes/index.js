
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: "Doxy.me - The simple, free, and secure way for the doc to see you" });
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name);
};
