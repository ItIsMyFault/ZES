function extractConfession()
{
	console.log("extract confession");
	
	var confNode = $("td.conftext:eq(0)");
	
	var result = new Array();
	
	result["textNode"] = confNode;
	result["text"] = confNode.text();

	var userLineNode = confNode.parent().next();
	
	var userNode = $("td.signinfo:eq(0) > span", userLineNode);
	result["userNode"] = userNode;
	result["userName"] = userNode.text().trim();
	result["userID"] = 0;
	
	// Registered user?
	if (userNode.hasClass("signnick"))
	{
		// Yes, user is registered, let's extract his/her ID
		var t = $("a", userNode).attr('href');
		result["userID"] = t.replace(/\D/g, '');
	}
	
	//console.log(userNode.text());
	console.log(result.userID);
	
	return result;
}

function extractAbsolutions()
{
	console.log("extract absolutions");
}

function findAndFixBrokenLinks(text)
{
	

	return text;
}

document.addEventListener("beforeload", function(event)
{
	console.log(event);

	if (event.url == "http://zpovednice.cz/captcha.php")
	{
		event.preventDefault();
		$(event.target).remove();
	}
	
}, true);

$(document).ready(function()
{
	init();

	var confession = extractConfession();
	var absolutions = extractAbsolutions();
	
	confession.textNode.text(findAndfixBrokenLinks(confession.textNode.text()));

});
