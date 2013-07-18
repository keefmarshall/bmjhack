/**
 * Event storage and retrieval
 */
var mongojs = require("mongojs");
var db = require("../mongodb.js");
var qrCode = require('qrcode-npm');
var ObjectId = mongojs.ObjectId;

exports.get = function(req, res)
{
        db.events.findOne({"_id" : ObjectId(req.params.eventid)}, function(err, event) {
                if (err || !event) {res.send("Event " + req.params.eventid + " not found."); return; };

                event["qr"] = createQRCodeImgTag(req.params.eventid);
                res.render("event", {event : event});
        });
};

exports.newevent = function(req, res)
{
	db.people.findOne({"_id" : ObjectId(req.body.tutorid)}, function(err, tutor){
		if (err || !tutor) {res.send("Tutor " + req.body.tutorid + " not found.");};
        var event = { 
        		"tutorid" : req.body.tutorid, 
        		"name" : req.body.name,
        		"tutor" : tutor.name
        		};
        db.events.save(event, function(err, saved) {
                if (!err && saved)
                {
                    saved["qr"] = createQRCodeImgTag(saved._id + "");
                    //res.render("event" , {event : saved});
                    res.redirect("/event/" + saved._id);
                }
        });
	});
};

exports.createevent = function(req, res)
{
	res.render("edit-event", { personid : req.params.personid });
};

exports.eventlist = function(req, res)
{
	if (req.params.tutorid)
	{
		var tutorid = req.params.tutorid;
		db.events.find({"tutorid" : tutorid}, function(err, events) {
			if (!err && events)
			{
				var eventids = [];
				var eventMap = {};
				for (var i = 0; i < events.length; i++)
				{
					var event = events[i];
					event.attendanceCount = 0;
					event.feedbackCount = 0;
					eventids.push(event._id + ""); // must be a string
					eventMap[event._id] = event;
				}
				
				// now find attendances
				// arguably we should store them like this in Mongo but it makes it 
				// harder to search attendances by attendee.. this is relational data really
				db.attendances.find({"eventid" : { "$in" : eventids}}, function(err, atts) {
					console.log("Got atts = " + atts);
					if (!err && atts)
					{
						for (var i = 0; i < atts.length; i++)
						{
							console.log("here");
							var att = atts[i];
							var event = eventMap[att.eventid];
							event.attendanceCount = event.attendanceCount + 1;
							if (att.feedback)
							{
								event.feedbackCount = event.feedbackCount + 1;
							}						
						}
						res.json(events);
					}
					else
					{
						console.log(err);
					}
						
				});
			}
		});
		
		// alternative, we can use attendances because they also contain the name and also then 
		// allow counting attendees - OH no we can't in case event has no attendances! whoops.
	}
	else 
	{
		db.events.find(function(err, events) {
			res.render("eventlist", {"events" : events, "tutorid" : ""});
		});
	}
};

//////////////////////////////

function createQRCodeImgTag(text)
{
    var qr = qrCode.qrcode(5, 'M'); // 6 gives us roughly 100 characters, 5 might be enough, not sure.
    qr.addData("http://bmj-lt12328:3000/checkin/" + text);
    qr.make();
    
    // NB the number here relates to the physical size of the generated image
    return qr.createImgTag(6);    // creates an <img> tag as text
}

