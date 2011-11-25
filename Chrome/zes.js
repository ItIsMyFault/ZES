String.prototype.trim = function()
{
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

function replaceConfLinks(text)
{
	return text.replace(/\b(\d{6})\b/g, '<a class="confLink" target="_blank" href="detail.php?statusik=$1">$1</a>');
}

function removeSpaces(text)
{
	var result = "";
	
	for (var i = 0; i < text.length; i++)
		if (text[i] != " ") result += text[i];
	
	return result;
}

function getSelectedText()
{
	var result = "";

	if (window.getSelection)
	{
		result = window.getSelection();
	}
	else if (document.getSelection)
	{
		result = document.getSelection();
	}
	else if (document.selection)
	{
		result = document.selection.createRange().text;
	}

	return result;
}

var selecting = false;
var frame, frameLink, googleLink, wikiLink;
var footerPanel;

function enablePictureHandler()
{
	$('body').append('<div id="pictureFrame" style="box-shadow: 3px 3px 8px #000000; display: none; top: 0px; left: 0px; position: absolute !important; z-index: 100 !important;"><img src="" /></div>');
	var frame = $('#pictureFrame');
	
	$('img', frame).error(function()
	{
		frame.hide();
	});
	
	$('a').each(function()
	{
		var link = "" + $(this).attr('href');
	
		if (link.indexOf("profil.php?kdo=") == 0)
		{
			$(this).hover(function()
			{
				var t = $(this).attr('href');
				var id = t.replace(/\D/g, '');
				$('img', frame).attr('src', 'http://www.zpovednice.cz/foto/id' + id + '.jpg');
				frame.show();

			}, function()
			{
				frame.hide();
			})
			.mousemove(function(e)
			{
				frame.css('left', (24 + e.pageX) + 'px');
				frame.css('top', (260 + e.pageY) + 'px');
			});	
		}
	});
}

function enableSelectHandler()
{
	$('body').append('<div id="linkFrame" style="display: none; top: 0px; left: 0px; position: absolute !important; z-index: 100 !important;">Odkaz bez mezer:<br><a id="link" target="_blank" href="http://www.google.com" /></a><hr><a id="googleLink" target="_blank" href="http://www.google.com" /></a><br><a id="wikiLink" target="_blank" href="http://www.wikipedia.org" /></a></div>');
	frame = $('#linkFrame');
	frameLink = $('#link', frame);
	googleLink = $('#googleLink', frame);
	wikiLink = $('#wikiLink', frame);
	
	frameLink.mousedown(function()
	{
		window.open($(this).attr("href"), "_blank");
	});
	
	googleLink.mousedown(function()
	{
		window.open($(this).attr("href"), "_blank");
	});	
	
	wikiLink.mousedown(function()
	{
		window.open($(this).attr("href"), "_blank");
	});	

	$(document).mousedown(function()
	{
		frame.hide();		
		selecting = true;
	})
	.mousemove(function(e)
	{
		if (selecting)
		{
			frame.css('left', (24 + e.pageX) + 'px');
			frame.css('top', (260 + e.pageY) + 'px');
			
			var selected = removeSpaces("" + getSelectedText());
			
			if (selected.substr(0, 7) != "http://" && selected.substr(0, 6) != "ftp://" && selected != "")
			{
				selected = "http://" + selected;
			}
			
			if (selected.length < 50)
				frameLink.text(selected);
			else
				frameLink.text(selected.substr(0, 50) + "...");
				
			frameLink.attr("href", selected);
			
			googleLink.text("Vyhledat na Google.cz");
			googleLink.attr("href", "http://www.google.cz/#q=" + getSelectedText());

			wikiLink.text("Vyhledat na Wikipedia.org");
			wikiLink.attr("href", "http://en.wikipedia.org/w/index.php?search=" + getSelectedText());

			if (selected != "" && selected.length <= 255 && selected.indexOf("\n") == -1)
			{
				frame.show();
			}
			else frame.hide();
		}
	})
	.mouseup(function()
	{
		if (selecting)
		{

		}
		else
		{
			frame.hide();
		}

		selecting = false;
	});
}

function init()
{
	enablePictureHandler();
	enableSelectHandler();
}
