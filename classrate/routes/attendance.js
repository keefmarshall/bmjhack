/**
 * Manage attendance data
 */

var db = require("../mongodb.js");
var ObjectId = require("mongojs").ObjectId;

exports.cookiecheckin = function(req, res)
{
	if (req.cookies.personid)
	{
		console.log("Cookie checkin: got personid '" + req.cookies.personid + "', checking in");
		return checkin(req, res);
	}
	else
	{
		console.log("Cookie checkin: no personid in cookie, showing registration page..");
		res.render("register",  { eventid : req.params.eventid} );
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
						res.redirect("/feedback/" + saved._id);
					}
				});
			});
		}
	});
	
};

exports.checkin = checkin;

exports.leavefeedback = function(req, res)
{
	var attid = req.params.attendanceid;
	db.attendances.findOne({"_id" : ObjectId(attid)}, function(err, attendance) {
		if (err || !attendance) 
		{
			res.render("error", {error: "Can't find your attendance record for that event!"});
		}
		else
		{
			res.render("feedback", {attendance : attendance});
		}
	});
};

exports.feedback = function(req, res)
{
	// TODO: fix next line, doesn't work:
	var attid = req.body.attendanceid || req.params.attendanceid;
	var feedback = req.body.feedback;
	db.attendances.update({"_id" : ObjectId(attid)}, {$set: { "feedback" : feedback}}, function(err, updated) {
		if (!err)
		{
			console.log("updated feedback successfully!");
			console.log(updated);
			
			//res.send("updated successfully");
			// "updated" is apparently not the attendance object. It's either 0 or 1...
			db.attendances.findOne({"_id" : ObjectId(attid)}, function(err, attendance) {
				console.log("attid = " + attid + ": " + JSON.stringify(attendance));
				res.render("thanks", {"attendance" : attendance} );
			});
		}
		else
		{
			console.log("error updating feedback " + err);
			res.render("error", {error: "Whoops, your feedback was not saved, something went wrong. Sorry!"});
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
