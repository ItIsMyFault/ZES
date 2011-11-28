enhancePrototypes();

// Cas v sekundach, po ktery jsou jednotlive datove cache povazovany za validni.
// Relativne primitivni ochrana proti pretizeni Zpovednice duplicitnimi dotazy
// na on-line uzivatele, na stav chatu, pocet novych zprav apod.
var cacheRefreshTime = 10;

// Cache online uzivatelu
var onlineUsersCache =
{
	time: 0,
	users: []
};

// Cache chatovaciho okna
var chatWindowCache =
{
	time: 0
};

function getOnlineUsers()
{
	var date = new Date();
	var timeDelta = date.getTime() - onlineUsersCache.time;
	
	if (timeDelta > cacheRefreshTime * 1000)
	{
		onlineUsersCache.time = date.getTime();

		$.get("http://www.zpovednice.cz/stat.php?prehled=4", function(data)
		{
			onlineUsersCache.users = [];
		
			var users = data.betweenArray('<td  class="lstconf"><A href="profil.php?', '</td>');
			
			for (var i = 0; i < users.length; ++i)
			{
				var userName = users[i].between('target=_blank>', '</A>');
				var userID = parseInt(users[i].between('kdo=', '"'));
				
				if (userName.length > 0)
				{
					onlineUsersCache.users.push({ name: userName, id: userID });
				}
			}
		});
	}

	return onlineUsersCache;
}

function isChatWindowCacheValid()
{
	var response = {};
	
	var date = new Date();
	var timeDelta = date.getTime() - chatWindowCache.time;
	
	response.time = chatWindowCache.time;
	
	if (timeDelta > cacheRefreshTime * 1000)
	{
		response.valid = false;
	}
	else
	{
		response.valid = true;
	}
	
	return response;
}

function setChatWindowData(data)
{
	var date = new Date();
	chatWindowCache.time = date.getTime();
	
	data = data.between('<tr><td class="chatwin" width="100%"  valign="top">', '</td>');
	
	var rawChatLines = data.betweenArray('', '</span><br>');
	
	for (var i = 0; i < rawChatLines.length; ++i)
	{
		var line = rawChatLines[i];
		
		var timeString = line.between('', '<span class="chattxt1">');
		var fromTo = line.between('<B>', '</B>');
		var text = line.between('</B>', '');
	}
}

$(document).ready(function()
{
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
	{
		switch (request.type)
		{
			case "getOnlineUsers":
			{
				sendResponse(getOnlineUsers());
			}
			break;
			
			case "isChatWindowCacheValid":
			{
				sendResponse(isChatWindowCacheValid());
			}
			break;
			
			case "setChatWindowData":
			{
				setChatWindowData(request.data);
			}
			break;
			
			default:
			{
				console.log("Unknown request type: " + request.type);
			}
			break;
		}
	});
});