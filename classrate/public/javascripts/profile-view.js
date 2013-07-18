$(function() {

	//$("#new-event-button").click(createEventPopup); // all done inline in bootstrap
	loadCreatedEvents();
	
});

function loadCreatedEvents()
{
	$.getJSON("/eventlist/" + personid, function(events) {
		var lines = [];
		if (events.length > 0)
		{
			lines.push("<ul class='event-list unstyled'>");
			$.each(events, function(n, event) {
				lines.push("<li><a class='event-link' id='" + event._id 
						+ "' href='/event/" + event._id + "'>" + event.name + 
						" (" + event.attendanceCount + ")"
						+ (event.feedbackCount > 0 ? " <i class='icon-certificate'></i>" : "")
						+ "</a></li>");
			});
			lines.push("</ul>");
		}
		else
		{
			lines.push("<p>You haven't created any events yet. Use the button above to create one.</p>");
		}
		
		$("#created-events").html(lines.join("\n"));
	});
			
}

