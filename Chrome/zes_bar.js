// Global chat bar instance
var ChatBar = null;

function ChatBarPanelClass(chatBarParent)
{
	// Properties
	// ----------
	this.parent = chatBarParent;
	this.node = null;
	this.buttonNode = null;
	this.panelNode = null;
	this.contentNode = null;
	
	var title = "(unknown)";
	var titleNode = null;
	var canClose = false;
		
	// Methods
	// -------
	this.invalidate = function()
	{
		this.buttonNode.text(title);
		titleNode.text(title);
		
		if (canClose)
		{
			this.buttonNode.append('&nbsp;<a href="javascript:void();"><img src="' + chrome.extension.getURL("icon_close.png") + '" /></a>');
			
			var callee = this;
			$("a", this.buttonNode).click(function()
			{
				callee.parent.removePanel(callee);
			});
		}
	
		var x = this.node.offset().left;
		var width = this.buttonNode.outerWidth();
		
		this.panelNode.css("left", (x + width - 203).toString());
	}
	
	this.setTitle = function(newTitle)
	{
		if (title != newTitle)
		{
			title = newTitle;
			this.invalidate();
		}
	}
	
	this.getTitle = function() { return title; }

	this.addCloseButton = function()
	{
		canClose = true;
		this.invalidate();
	}
	
	// Constructor
	// -----------
	if (chatBarParent != null)
	{
		this.parent.node.prepend('<div class="chatBarContainer"></div>');
		this.node = $("div.chatBarContainer:eq(0)", this.parent.node);
		
		this.node.append('<a href="javascript:void();" class="chatBarButton">(unknown)</a>');
		this.node.append('<div class="chatBarPanel"><title></title><div class="content"></div></div>');
		
		this.buttonNode = $("a.chatBarButton", this.node);
		this.panelNode = $("div.chatBarPanel", this.node);
		this.contentNode = $("div.content", this.panelNode);
		
		titleNode = $("title", this.panelNode);
		
		var callee = this;
		this.buttonNode.click(function()
		{
			if (!callee.panelNode.is(':visible'))
				callee.parent.hideAllPanels();
				
			callee.panelNode.toggle();
			callee.invalidate();
		});
		
		this.invalidate();
	}
}

function PrivateChatPanelClass(chatBarParent)
{
	// Properties
	// ----------
	this.userID = 0;
	this.inputNode = null;
		
	// Methods
	// -------

	// Constructor
	// -----------
	ChatBarPanelClass.call(this, chatBarParent);
	
	if (chatBarParent != null)
	{
		this.contentNode.append('<input type="text" />');
		this.inputNode = $("input", this.contentNode);
		
		var callee = this;
		this.inputNode.keypress(function(event)
		{
			if (event.which == 13)
			{
				if (callee.userID > 0)
				{
					$.get("box.php?kec=" + escape($(this).attr("value")) + "&komu=" + callee.userID.toString() + "&send=true&ido=&m=", function(data)
					{
					});
				}
				
				$(this).attr("value", "");
			}
		});
	}
}

// PrivateChatPanelClass is derived from ChatBarPanelClass
PrivateChatPanelClass.prototype = new ChatBarPanelClass;

function OnlineUsersPanelClass(chatBarParent)
{
	// Properties
	// ----------
		
	// Methods
	// -------

	// Constructor
	// -----------
	ChatBarPanelClass.call(this, chatBarParent);
	this.setTitle("Uživatelé online");
}

// OnlineUsersPanelClass is derived from ChatBarPanelClass
OnlineUsersPanelClass.prototype = new ChatBarPanelClass;

function ChatBarClass()
{
	// Properties
	// ----------
	this.panels = [];
	this.node = null;
	this.usersPanel = null;
		
	// Methods
	// -------
	this.addPanel = function(panel)
	{
		this.panels.push(panel);
	}
	
	this.removePanel = function(panel)
	{
		var index = this.panels.indexOf(panel);
	
		if (index >= 0)
		{
			panel.node.remove();
			this.panels.removeAt(index);
		}
	}
	
	this.hideAllPanels = function()
	{
		for (var i = 0; i < this.panels.length; ++i)
		{
			var panel = this.panels[i];
			panel.panelNode.hide();
		}
	}
	
	this.indexOfPanel = function(title)
	{
		for (var i = 0; i < this.panels.length; ++i)
		{
			var panel = this.panels[i];
			
			if (panel.getTitle() == title)
				return i;
		}
		
		return -1;
	}
	
	this.setUsersArray = function(usersArray)
	{
		var html = "";
		
		html += "<ul>";
		
		for (var i = 0; i < usersArray.length; ++i)
		{
			html += '<a href="javascript:void();" userID="' + usersArray[i].id.toString() + '" class="onlineUser"><li>';
			html += usersArray[i].name;
			html += '</li></a>';
		}
		
		html += "</ul>";
		
		this.usersPanel.contentNode.html(html);
		this.usersPanel.setTitle("Uživatelé online (" + usersArray.length.toString() + ")");
		
		var callee = this;
		$("a.onlineUser", this.usersPanel.contentNode).click(function()
		{
			var panelIndex = callee.indexOfPanel($(this).text());

			callee.hideAllPanels();
			
			if (panelIndex == -1)
			{
				var newPanel = new PrivateChatPanelClass(callee);
				callee.addPanel(newPanel);
				
				newPanel.setTitle($(this).text());
				newPanel.userID = parseInt($(this).attr("userID"));
				newPanel.addCloseButton();
			}
			else
			{
			
			}
		});
	}
	
	// Constructor
	// -----------
	$("div#allini").append('<center><div id="bottomChatBar"></div></center>');
	this.node = $("#bottomChatBar");
	
	this.usersPanel = new OnlineUsersPanelClass(this);
	this.addPanel(this.usersPanel);
}

function checkChatRoom()
{
	chrome.extension.sendRequest(
	{
		type: "isChatWindowCacheValid"
	},
	function(response)
	{
		if (response.valid == false)
		{
			$.get("mistnost.php", function(html)
			{
				chrome.extension.sendRequest(
				{
					type: "setChatWindowData",
					data: html
				});
			});
		}
	});
	
	chrome.extension.sendRequest(
	{
		type: "getOnlineUsers"
	},
	function(response)
	{
		ChatBar.setUsersArray(response.users);
		setTimeout(checkChatRoom, 1000);
	});
}

function initBar()
{
	console.log("initialize bar");
	
	ChatBar = new ChatBarClass();

	checkChatRoom();
}
