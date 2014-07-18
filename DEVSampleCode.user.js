// ==UserScript==  
// @name         SampleCodeCollector
// @version      1.0.0
// @author       larryhou@github.com
// @namespace    https://github.com/larryhou
// @description  Collect sample code from developer.apple.com
// @include      https://developer.apple.com/library/*
// ==/UserScript==

function install(callback)
{	
	//console.log("==============init==============");
	if (location.href.indexOf("https://developer.apple.com/library") != 0 ) return;
	//console.log(location.href);
	
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";

	var cb = document.createElement("script");
	cb.type = "text/javascript";
	cb.textContent = "jQuery.noConflict();(" + callback.toString() + ")(jQuery);";
	script.addEventListener('load', function() 
	{
		document.head.appendChild(cb);
	});
	
	document.head.appendChild(script);	
}


// https://developer.apple.com/devcenter/mac/loadredemptioncode.action?seedId=13CB96H8S4

install(function($)
{
	if (location.href.indexOf("samplecode") > 0)
	{
		$(document).ready(function()
		{			
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
				if (retryCount < 10)
				{
					retryCount++;
					id = setTimeout(doJob, 100);
				}
				else
				{
					console.log("ERR: " + location.href);
					parent.extractSampleCode();
				}
			}
			
			doJob();			
		});	
		
		return;
	}
	
	var pagelist = [];
	var rawlist = [];
	
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
			console.log("============<DONE!>============");
		}
	}
	
	window.displaySampleCode = function(url)
	{
		url = "https://developer.apple.com" + url;
		url = "<a href='" + url + "'>" + url + "</a>";
		
		var data = rawlist[index - 1];
		var text = "[" + data[3] + ":" + data[1] + "][" + data[0] + "] " + url;
		var item = $("<p style='font-family: Consolas'>[" + new Date() + "]page: " + window.page + "</p>")
		$(window.frames["result"].contentDocument).find("p[id='content']").append("<div>" + text + "</div>");
		
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
				rawlist.push(docs[i]);
				url = url.replace(/^../, "https://developer.apple.com/library/prerelease/ios");
				pagelist.push(url);
			}
		}
		
		extractSampleCode();
	});
});