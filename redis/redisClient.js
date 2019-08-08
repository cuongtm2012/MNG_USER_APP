var redis = require('redis');
var redisClient = redis.createClient({host : 'localhost', port : 6379});
module.exports = redisClient;