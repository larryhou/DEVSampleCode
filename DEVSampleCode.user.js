// ==UserScript==  
// @name         SampleCodeExtractor
// @version      1.0.0
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
	if (location.href.indexOf("samplecode") > 0)
	{
		if (location.href.indexOf("src=larryhou") < 0)return;
		
		$(document).ready(function()
		{	
			const INTERVAL = 100;
			const MAX_RETRY_COUNT = Math.ceil(5000 / INTERVAL);
					
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
	
	var index = 0;
	window.extractSampleCode = function()
	{
		if (index < pagelist.length)
		{
			$("#kernel").attr("src", pagelist[index]);
			index++;
		}
		else
		{
			$("#kernel").remove();
			$("<iframe width='100%' height='300' id='summrize' frameborder='no' border='0'/>").insertAfter($("#result"));
			
			var doc = window.frames["summrize"].contentDocument;
			$(doc).ready(function()
 			{
				$(doc.body).css("font-family", "Consolas");
				$(doc.body).append(ziplist.join("\n"));
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
			var str = index + "";
			while (str.length < 3) str = "0" + str;
			return str;
		}		
		
		url = "<a href='" + url + "'>" + url + "</a>";
		
		var data = jsonlist[index - 1];
		var text = getFormatedIndex() + ".[" + data[3] + ":" + data[1] + "][" + data[0] + "] " + url;
		var item = $("<p style='font-family: Consolas'>[" + new Date() + "]page: " + window.page + "</p>")
		$(window.frames["result"].contentDocument).find("p[id='content']").append("<div>" + text + "</div>\n");
		
		var ibody = window.frames["result"].contentDocument.body;
		ibody.scrollTop = ibody.scrollHeight;
		
		extractSampleCode();
	}

	$("<iframe width='100%' height='300' id='result' frameborder='no' border='0'/>").prependTo("body");
	$(window.frames["result"].contentDocument.body).append($("<p id='content' style='font-family: Consolas'/>"));
	
	$("<iframe width='100%' height='300' id='kernel' frameborder='no' border='0'/>").prependTo("body");

	$.getJSON("https://developer.apple.com/library/prerelease/ios/navigation/library.json",
	function(data)
	{	
		var docs = data.documents;
		docs.sort(function(a,b)
		{
			return a[3] > b[3]? -1 : 1;
		});
			
		var url;		
		for(var i = 0; i < docs.length; i++)
		{
			url = docs[i][9];
			if (url.indexOf("samplecode") > 0)
			{
				jsonlist.push(docs[i]);
				url = url.replace(/^../, "https://developer.apple.com/library/prerelease/ios") + "?src=larryhou";
				pagelist.push(url);
			}
		}
		
		extractSampleCode();
	});
});