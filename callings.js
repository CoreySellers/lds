$(document).ready(function(){
	$.getJSON( "callings.json", function( data ) {
		var items = [], returnedList;

		//items.push("<table border='1'>");
		returnedList = outputCallings(data);
		for (var i = 0; i < returnedList.length; i++) {
			items.push(returnedList[i])
		}
		//items.push("</table>");

		$( "<ul/>", {
			"class": "my-new-list",
			html: items.join( "" )
		}).appendTo( "body" );
		$("span").css("color", "red");
	});

	function outputCallings(data) {
		var items = [],
			subOrgs = false,
			missingCallings;
		$.each( data, function( key, val ) {
			if (val.name) {
				if ((val.name === val.parentName || val.parentName === "Other Callings") && val.name != "Other Callings") {
					if (items.length > 0) {
						if (items[items.length-1].indexOf("table") > 0) {
							items.pop();
						}
						if (items[0].indexOf("table") > 0 && items[items.length-1].indexOf("table") < 0) {
							items.push("</table>");
						}
					}
					items.push("<table border='1' style='width:400px'>");
				}
				if (val.name !== "Full-Time Missionaries" && val.name != "Other Callings") {
					items.push( "<tr><th colspan='2'>" + val.name + "</th></tr>" );
				}
			}
			else if (!val.memberName) {
				if (missingCallings === undefined) {
					missingCallings = true;
				}
				items.push( "<tr><td style='width:250px'>" + trimPositions(val.position) + "</td><td style='width:150px'>" + "<span>Calling Vacant</span></td></tr>" );
			}
			else if (val.memberName && val.position != "Priests Quorum President") {				
				missingCallings = false;
				items.push( "<tr><td style='width:250px'>" + trimPositions(val.position) + "</td><td style='width:150px'>" + formatName(val.memberName) + "</td></tr>" );
			}
			if (val.childSubOrgs && val.childSubOrgs.length > 0) {
				returnedList = outputCallings(val.childSubOrgs);
				if (returnedList.length === 0) {
					items.pop();
				}				
				else {
					subOrgs = true;
					missingCallings = false;
					for (var i = 0; i < returnedList.length; i++) {
						items.push(returnedList[i])
					}
				}
			}
			if (val.callings && val.callings.length > 0) {
				returnedList = outputCallings(val.callings);
				if (returnedList.length === 0 && items.length > 0 && (items[items.length-1].indexOf("</td>") < 0 || items[items.length-1].indexOf("Calling Vacant") > 0)) {
					items.pop();
				}				
				else {
					missingCallings = false;
					if (subOrgs && returnedList.length > 0 && items[items.length-1].indexOf(val.name) < 0) {
						if (items[items.length-1] === "</table>") {
							items.push("<table border='1' style='width:400px'>");
						}
						items.push( "<tr><th colspan='2'>" + val.name + "</th></tr>" );
					}
					for (var i = 0; i < returnedList.length; i++) {
						items.push(returnedList[i])
					}
				}
			}
		});
		if (items.length === 0 || missingCallings) {
			return [];
		}
		else {
			if (items.length > 0 && items[0].indexOf("table") > 0) {
				if (items[items.length-1].indexOf("table") > 0) {
					items.pop();
				}
				else {
					items.push("</table>");
				}
			}
			return items;
		}	
	}

	function formatName(name) {
		var comma, space, fullLast, last, fullFirst, first;
		comma = name.indexOf(",");
		fullLast = name.substr(0, comma),
		space = fullLast.indexOf(" "),
		last = space < 0 ? fullLast : fullLast.substr(0, space);
		if (last === "De") last = fullLast;
		fullFirst = name.substr(comma + 2),
		space = fullFirst.indexOf(" "),
		first = space < 0 ? fullFirst : fullFirst.substr(0, space);
		return first + " " + last;
	}

	function trimPositions(position) {
		position = trimPosition(position, "Bishopric ");
		position = trimPosition(position, "Elders Quorum ");
		position = trimPosition(position, "Relief Society ");
		position = trimPosition(position, "Sunday School ");
		position = trimPosition(position, "Visiting Teaching ");
		position = trimPosition(position, "Compassionate Service ");
		return position;
	}

	function trimPosition(position, find) {
		var pos = position.indexOf(find);
		if (pos >= 0) {
			return position.substr(find.length);
		}
		return position;
	}
});
