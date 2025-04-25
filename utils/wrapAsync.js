// filepath: c:\Users\LENOVO\OneDrive\Desktop\trustytravals\utils\wrapAsync.js
module.exports = function (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
};