/*
 * Simple login / logout
 */

exports.login = function(req, res)
{
	var personid = req.params.personid;
	setLoginCookie(res, personid);
	res.redirect("/person/" + personid);
};

exports.logout = function(req, res)
{
	res.clearCookie("personid");
	res.redirect("/");
};

exports.register = function(req, res)
{ 
	console.log("Passed-through eventid = " + req.params.eventid);
	return res.render("register", { eventid : req.params.eventid });
};

function setLoginCookie(res, personid)
{
	res.cookie("personid", personid, { maxAge : 31556952000}); // set cookie for a year	
};

exports.setLoginCookie = setLoginCookie;


