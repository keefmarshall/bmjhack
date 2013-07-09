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
			res.render("eventlist", {"events" : events, "tutorid" : tutorid});
		});
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

