function removeAdBlocks()
{
	var allowedTitles = ["Seznam zpovědí:", "Přihlášení:", "Zpovědnice:", "Provozovatel:", "Hledání:", "Zobrazení:"];

	$("div.boxheadsp, div.boxheader").each(function()
	{
		// Is this an allowed title?
		if (allowedTitles.indexOf($(this).text().trim()) < 0)
		{
			// Nooope! Chuck Testa...
			while ($(this).next().hasClass("boxaround"))
				$(this).next().remove();
			
			$(this).remove();
		}
	});
}

$(document).ready(function()
{
	init();
	initBar();
	removeAdBlocks();
});
