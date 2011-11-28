function enhancePrototypes()
{
	console.log("enhance prototypes");

	if (!Array.prototype.indexOf)
	{
		Array.prototype.indexOf = function(obj)
		{
			for (var i = 0; i < this.length; i++)
			{
				if (this[i] == obj)
				return i;
			}
			
			return -1;
		}
	}

	if (!Array.prototype.contains)
	{
		Array.prototype.contains = function(obj)
		{
			return this.indexOf(obj) >= 0;
		}
	}

	if (!Array.prototype.removeAt)
	{
		Array.prototype.removeAt = function(from, to)
		{
			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			this.push.apply(this, rest);
			
			return true;
		}
	}

	if (!Array.prototype.remove)
	{
		Array.prototype.remove = function(obj)
		{
			var index = this.indexOf(obj);
			if (index < 0) return false;
			
			return this.removeAt(index);
		}
	}

	String.prototype.trim = function()
	{
		return this.replace(/^\s*/, "").replace(/\s*$/, "");
	}

	String.prototype.between = function(start, end)
	{
		var startIndex = start.length > 0 ? this.indexOf(start) : 0;
		if (startIndex == -1) return "";
		
		startIndex += start.length;
		
		var endIndex = end.length > 0 ? this.indexOf(end, startIndex) : this.length - 1;
		if (endIndex == -1) return "";
		
		return this.substr(startIndex, endIndex - startIndex);
	}

	String.prototype.betweenArray = function(start, end)
	{
		var result = [];
		
		var startIndex = 0;

		while (true)
		{
			startIndex = start.length > 0 ? this.indexOf(start, startIndex) : startIndex;
			if (startIndex == -1) return result;
			
			startIndex += start.length;

			var endIndex = this.indexOf(end, startIndex);
			if (endIndex == -1) return result;
			
			result.push(this.substr(startIndex, endIndex - startIndex));

			startIndex = endIndex + end.length;
		}
		
		// Should never get there...
		return result;
	}
}

enhancePrototypes();
