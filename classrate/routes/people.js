/**
 * Methods around editing/retrieving people
 */
var db = require("../mongodb.js");
var ObjectId = require("mongojs").ObjectId;

exports.get = function(req, res)
{
	db.people.findOne({"_id" : ObjectId(req.params.personid)}, function(err, person) {
        if (err || !person) {res.send("Person " + req.params.person + " not found."); return; };

        res.render(person.type, {person : person});
	});

};

exports.list = function(req, res)
{
	db.people.find(function(err, people) {
        res.render("people", {people : people});
	});
};

exports.register = function(req, res)
{
	var person = {
			"name" : req.body.name,
			"code" : req.body.code,
			"type" : req.params.type
			};
	
	db.people.save(person, function(err, saved){
		if (!err && saved)
		{
			if (req.body.app != null)
			{
				res.json(saved);
			}
			else
			{
				res.render(saved.type, {"person" : saved});
			}
		}
	});
};

exports.registerForm = function(req, res)
{
	res.render("register", {"type" : req.params.type});	
};
