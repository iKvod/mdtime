/**
 * Created by rafa on 12/05/2017.
 */





var getTimelate = function (botId, cb) {

  botDbHelper(botId, function (err, data) {
    if(err){
      cb(err, null);
      return;
    }
    dbHelper.gettAllrouteExtnended(
      Timelates,
      { userId : data._id },
      { created_at: 1, latetype: 1, latetime: 1},
      null,
      function (err, lateReport){
        if(err){
          cb(err, null);
          return;
        }
        cb(null, lateReport);
      }
    )
  })
};


module.exports = {
  getTimelate: getTimelate
};
