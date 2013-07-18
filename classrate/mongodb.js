/**
 * Isolated MongoDB setup
 * 
 * When needed, just do: 
 * 
 * var mongodb = require("./mongodb");
 */

var databaseURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "localhost:27017/backfood";
var collections = ["events", "people", "attendances"];
var mongodb = require("mongojs").connect(databaseURI, collections);

module.exports = mongodb;

