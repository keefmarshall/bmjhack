
/*
 * GET home page.
 */

exports.index = function(req, res)
{
	if (req.cookies.personid)
	{
		res.redirect("/person/" + req.cookies.personid);
	}
	else
	{
		res.render('index', { title: 'ClassRATE' });
	}
};