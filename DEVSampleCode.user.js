// ==UserScript==  
// @name         SampleCodeExtractor
// @version      1.3.2
// @author       larryhou@github.com
// @namespace    https://github.com/larryhou
// @description  Extract url of sample code zip-file from developer.apple.com
// @include      https://developer.apple.com/library/*
// ==/UserScript==

function install(callback)
{	
	if (location.href.indexOf("https://developer.apple.com/library") != 0 ) return;
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js";

	var cb = document.createElement("script");
	cb.type = "text/javascript";
	cb.textContent = "jQuery.noConflict();(" + callback.toString() + ")(jQuery);";
	script.addEventListener('load', function() 
	{
		document.head.appendChild(cb);
	});
	
	document.head.appendChild(script);
}


// https://developer.apple.com/library/ios/navigation/#section=Resource%20Types&topic=Sample%20Code

install(function($)
{
	const TIME_OUT = 5000;
	if (location.href.indexOf("samplecode") > 0)
	{
		if (location.href.indexOf("src=larryhou") < 0)return;
		
		$(document).ready(function()
		{	
			const INTERVAL = 100;
			const MAX_RETRY_COUNT = Math.ceil(TIME_OUT / INTERVAL);
					
			var id, retryCount = 0;
			function doJob()
			{
				clearTimeout(id);
				
				var href = $("#Sample_link").attr("href");
				if (href)
				{
					parent.displaySampleCode(href)
				}
				else
				if (retryCount < MAX_RETRY_COUNT)
				{
					retryCount++;
					id = setTimeout(doJob, INTERVAL);
				}
				else
				{
					parent.logExtractError();
					parent.extractSampleCode();
				}
			}
			
			doJob();			
		});	
		
		return;
	}
	
	var pagelist = [];
	var jsonlist = [];
	
	var ziplist = [];
	var zipjson = [];
	
	var id;
	var index = 0;
	window.extractSampleCode = function()
	{
		clearTimeout(id);
		if (index < pagelist.length)
		{			
			$("#kernel").attr("src", pagelist[index]);
			index++;
			
			var callee = arguments.callee;
			id = setTimeout(function()
			{
				console.log(jsonlist[index - 1]);
				callee();
			}, TIME_OUT + 500);
		}
		else
		{
			$("#kernel").remove();
			$("<iframe width='100%' height='300' id='summrize' frameborder='no' border='0'/>").insertAfter($("#result"));
			
			var doc = window.frames["summrize"].contentDocument;
			$(doc).ready(function()
 			{
				$(doc.body).css("font-family", "Consolas,Menlo");
				for (var i = 0; i < ziplist.length; i++)
				{
					$(doc.body).append($("<div>" + ziplist[i] + "</div>"));
				}
				
				var sum = {}
				
				var prefix, prev;
				for (var i = 0; i < zipjson.length; i++)
				{					
					prefix = zipjson[i][3].slice(0, 4);
					if (prefix != prev)
					{
						sum[prefix] = [i + 1];
						if (sum[prev])
						{
							sum[prev].push(i);
						}
						
						prev = prefix;
					}
					else
					if (i == zipjson.length - 1)
					{
						sum[prefix].push(zipjson.length);
					}
				}
				
				function padding(value, length)
				{
					var rlt = String(value);
					
					var offset = length - rlt.length
					while (offset > 0)
					{
						rlt += "&nbsp";
						offset--;
					}
					
					return rlt;
				}
				
				var group = [];
				for (var key in sum)
				{
					group.push("group " + padding(sum[key][0], 4) + padding(sum[key][1], 4) + "${dir}/" + key);
					group[group.length - 1] = "<div>" + group[group.length - 1] + "</div>";
				}
				
				$(doc.body).append($(group.join(" ")));
 			});
			
			console.log("============<DONE!>============");
		}
	}
	
	window.logExtractError = function()
	{
		var url = pagelist[index - 1];
		console.log("ERR:" + url);
	}
	
	window.displaySampleCode = function(url)
	{
		url = "https://developer.apple.com" + url;
		ziplist.push(url);
		
		function getFormatedIndex()
		{
			var str = ziplist.length + "";
			while (str.length < 3) str = "0" + str;
			return str;
		}		
		
		var data = jsonlist[index - 1];
		zipjson.push(data);
		
		link = "<a href='" + url + "'>" + data[tkeys.name] + "</a>";
		
		var text = getFormatedIndex() + ".[" + data[tkeys.date] + ":" + data[tkeys.id] + "]" + link;
		var item = $("<p style='font-family: Consolas,Menlo'>[" + new Date() + "]page: " + window.page + "</p>")
		$(window.frames["result"].contentDocument).find("p[id='content']").append("<div>" + text + "</div>\n");
		
		var ibody = window.frames["result"].contentDocument.body;
		ibody.scrollTop = ibody.scrollHeight;
		
		extractSampleCode();
	}

	$("<iframe width='100%' height='300' id='result' frameborder='no' border='0'/>").prependTo("body");
	$(window.frames["result"].contentDocument.body).append($("<p id='content' style='font-family: Consolas,Menlo'/>"));
	
	$("<iframe width='100%' height='300' id='kernel' frameborder='no' border='0'/>").prependTo("body");

	$.getJSON("https://developer.apple.com/library/prerelease/ios/navigation/library.json",
	function(data)
	{	
		var docs = data.documents, tkeys = data.columns;
		parent.tkeys = tkeys;
		console.log(parent.Table);
		console.log(tkeys)
		
		docs.sort(function(a, b)
		{
			if (a[tkeys.date] != b[tkeys.date]) return a[tkeys.date] > b[tkeys.date]? -1 : 1
			if (a[tkeys.sortOrder] != b[tkeys.sortOrder]) return a[tkeys.sortOrder] > b[tkeys.sortOrder]? -1 : 1;
			return 0
		});
		
		var reg = /Sample\s*Code/i;
		var type = data.topics[0].contents.filter(function(item)
		{
			return reg.test(item.name);
		})[0].key;
			
		var url;		
		for(var i = 0; i < docs.length; i++)
		{
			url = docs[i][tkeys.url];
			if (docs[i][tkeys.type] == type)
			{
				jsonlist.push(docs[i]);
				url = url.replace(/^../, "https://developer.apple.com/library/prerelease/ios") + "?src=larryhou";
				pagelist.push(url);
			}
		}
		
		extractSampleCode();
	});
});