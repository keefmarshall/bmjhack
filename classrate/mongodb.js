/**
 * Isolated MongoDB setup
 * 
 * When needed, just do: 
 * 
 * var mongodb = require("./mongodb");
 */

var databaseURI = "localhost:27017/classrate";
var collections = ["events", "people", "attendances"];
var mongodb = require("mongojs").connect(databaseURI, collections);

module.exports = mongodb;

