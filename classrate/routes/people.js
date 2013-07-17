/**
 * Methods around editing/retrieving people
 */
var db = require("../mongodb.js");
var ObjectId = require("mongojs").ObjectId;
var auth = require("../routes/auth.js");

exports.get = function(req, res)
{
	db.people.findOne({"_id" : ObjectId(req.params.personid)}, function(err, person) {
        if (err || !person) {res.send("Person " + req.params.person + " not found."); return; };

        res.render("profile", {person : person});
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
			"type" : req.params.type || "tutor"
			};
	
	db.people.save(person, function(err, saved){
		if (!err && saved)
		{
			auth.setLoginCookie(res, saved._id);
			res.redirect("/person/" + saved._id);
		}
	});
};

exports.registerandcheckin = function(req, res)
{
	var person = {
			"name" : req.body.name,
			"code" : req.body.code,
			"type" : "student" // if checking in, must be attendee
			};
	
	db.people.save(person, function(err, saved){
		if (!err && saved)
		{
			auth.setLoginCookie(res, saved._id);
			//res.redirect("/checkin/" + req.body.eventid + "/" + saved._id);
			res.redirect("/checkin/" + req.body.eventid);
		}
	});
};

exports.registerForm = function(req, res)
{
	res.render("register", {"type" : req.params.type});	
};
