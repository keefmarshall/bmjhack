/**
 * Manage attendance data
 */

var db = require("../mongodb.js");
var ObjectId = require("mongojs").ObjectId;

exports.cookiecheckin = function(req, res)
{
	if (req.cookies.personid)
	{
		return checkin(req, res);
	}
	else
	{
		res.redirect("/login/" + req.params.eventid);
	}
};



function checkin(req, res) 
{
	var attendance = {
			eventid : req.params.eventid,
			personid : req.params.personid || req.cookies.personid,
			date : new Date()
	};
	
	// this checks that both event and person exist:
	db.events.findOne({"_id" : ObjectId(attendance.eventid)}, function(err, event){
		if (!err && event)
		{
			attendance["event"] = event["name"];
			attendance["tutorid"] = event["tutorid"];
			db.people.findOne({"_id" : ObjectId(attendance.personid)}, function(err, person) {
				console.log("Got person: " + person);
				attendance.person = person.name;
				db.attendances.save(attendance, function(err, saved) {
					if (!err && saved)
					{
						res.redirect("/person/" + saved.personid);
					}
				});
			});
		}
	});
	
};

exports.checkin = checkin;


exports.feedback = function(req, res)
{
	var attid = req.params.attendanceid;
	var feedback = req.body.feedback;
	db.attendances.update({"_id" : ObjectId(attid)}, {$set: { "feedback" : feedback}}, function(err, updated) {
		if (!err)
		{
			console.log("updated feedback successfully!");
			res.send("updated successfully");
		}
		else
		{
			console.log("error updating feedback " + err);
		}
	});
};

// events that a student attended
exports.attended = function(req, res)
{
	// find all attendances by this person:
	var personid = req.params.personid;
	db.attendances.find({"personid" : personid}, function(err, attendances) {
        res.json(attendances);
	});

};

// which students attended this event
exports.attendees = function(req, res)
{
	var eventid = req.params.eventid;
	db.attendances.find({"eventid" : eventid}, function(err, attendances) {
        res.json(attendances);
	});

};

exports.get = function(req, res)
{
	db.attendance.find({"_id" : req.params.attendanceid}, function(err, attendance)  {
		res.json(attendance);
	});
};
