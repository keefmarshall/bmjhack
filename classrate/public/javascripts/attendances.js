var attendances;

$(function(){
	showAttendances();
	
	$("#feedback-form").submit(function() {
		var url = "/feedback/" + $("input[name=_id]").val();
		var data = { "feedback" : $("textarea[id=feedback]").val() }; 

		$.post(url, data);
		$("#feedback-form-modal").modal("hide");
		$("textarea[id=feedback]").val("");
		showAttendances();
		return false;
	});
	
	
	if (window.location.hash.slice(1) == "attendances")
	{
		$("#attendances-tab-anchor").click();
	}

});

function showAttendances()
{
	$.getJSON("/attended/" + personid, function(atts) {
		attendances = {};
		var lines = [];
		if (atts.length > 0)
		{
			lines.push("<ul>");
			$.each(atts, function(row, att){
				attendances[att._id] = att;
				lines.push("<li><a href='/event/" + att.eventid + "'>" + att.event + "</a> ");
				if (att.feedback)
				{
					lines.push(" <a href='#' id='" + att._id + "' class='view-feedback-link'><i class='icon-certificate'></i>view feedback</a>");
				}
				else
				{
					lines.push(" <a href='#' id='" + att._id + "' class='leave-feedback-link'><i class='icon-plus'></i>leave feedback</a>");
				}
				lines.push("</li>");
			});
			lines.push("</ul>");
		}
		else
		{
			lines.push("<p>You haven't attended any events yet!</p>");
		}
		$("#attendances").html(lines.join(""));
		enableFeedbackLinks();
	});
}

function enableFeedbackLinks()
{
	$(".leave-feedback-link").click(function(e) {
		$("input[name=_id]").val($(this).attr("id"));
		$("#feedback-form-modal").modal("show");
		return false;
	});
	
	$(".view-feedback-link").click(function(e) {
		var attid = $(this).attr("id");
		var att = attendances[attid];
		$("#event").html(att.event);
		$("#feedback-view").html(att.feedback);
		$("#feedback-view-modal").modal("show");
		return false;
	});
};
