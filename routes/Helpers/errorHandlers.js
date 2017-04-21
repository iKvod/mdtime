/**
 * Created by rafa on 18/04/2017.
 */

var errorHandlerBasic = function (err, message, status) {
  err.message = message;
  err.status = status;
  return err;
};


module.exports = {
  errorHandlerBasic: errorHandlerBasic
};
