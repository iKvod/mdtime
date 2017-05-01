/**
 * Created by rafa on 28/04/2017.
 */
var redis = require('redis');
// var redisClient = redis.createClient({
//   host: 'localhost',
//   port: 6379
// });


// redisClient.on('ready', function () {
//   console.log('Successfully connected to Redis');
// });
// redisClient.on('error', function () {
//   console.log('Error on connecting to Redis');
// });


module.exports = redisClient;