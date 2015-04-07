/*Called on load, sets up the global namespace correctly*/
function editPageSetup () {
	
	//Load the default graph
	var inputText = $("#input").val();	
    	var graph = parse(inputText, "\n");

    	currentNodes = graph["nodes"];
    	currentEdges = graph["edges"];
    	saved = [];

    	if(typeof(String.prototype.trim) === "undefined") {
	    	String.prototype.trim = function() {
            		return String(this).replace(/^\s+|\s+$/g, ''); 
        	};
    	}

	//Load saved graphs or default saved graphs
    	if(!loadSaved()) {
		addCompleteGraphs();
	}
	//Greys out buttons until they will function properly 
   	$("#relButtons").children("button").prop("disabled",false);
    	style();
}


function drawPageSetup () {
    	saved = [];
    	loadSaved();
    	var isInit = false;
    	for(var graph in saved) {
		isInit = true;
		currentNodes = saved[graph]["nodes"];
		currentEdges = saved[graph]["edges"];
		break;
    	}
    	if(!isInit) {
		alert("You have not added any graphs.");
		window.location = "index.html";
    	}
    	sizeMenu();
    	var div = $("#relations");
    	div.css("width", (maxWidth(div, 56))+"px");
    	div.css("float", "left");
    	var dim = getSVGdimensions();
    	drawPageSVG = d3.select("#mySVG")
			.append("svg")
			.attr("width", dim.width)
			.attr("height", dim.height);

	//This code creates svg defs representing arrowheads for the edges. It has been borrowed from an example featured on d3js.org, which can be found at http://bl.ocks.org/rkirsling/5001347 - I did not write this code and I have not edited this code, beyond changing the name of the svg.
	drawPageSVG.append('svg:defs').append('svg:marker')
    				      	.attr('id', 'end-arrow')
    				      	.attr('viewBox', '0 -5 10 10')
    				      	.attr('refX', 6)
    				      	.attr('markerWidth', 3)
    				      	.attr('markerHeight', 3)
    				      	.attr('orient', 'auto')
  				      .append('svg:path')
    				      	.attr('d', 'M0,-5L10,0L0,5')
    				      	.attr('fill', '#000');

	drawPageSVG.append('svg:defs').append('svg:marker')
    				      	.attr('id', 'start-arrow')
				      	.attr('viewBox', '0 -5 10 10')
				      	.attr('refX', 4)
				      	.attr('markerWidth', 3)
				    	.attr('markerHeight', 3)
				    	.attr('orient', 'auto')
				      .append('svg:path')
				    	.attr('d', 'M10,-5L0,0L10,5')
    					.attr('fill', '#000');
	//End of borrowed code

	d3ForceReference = d3.layout.force()
				 .nodes(currentNodes)
				 .links(currentEdges)
				 .linkDistance(150)
				 .charge(-500)
				 .on("tick", graphTickFunction)
				 .size(dim);

	d3EdgeSelection = drawPageSVG.append("svg:g").selectAll("path");
	d3NodeSelection = drawPageSVG.append("svg:g").selectAll("g");
}

function aboutPageSetup () {
    sizeMenu();
    var width = 650;
    if($(window).width < 700) {
	width = $(window).width - 50;
    }

    $("#aboutText").css("width", width+"px");
    center($("#aboutText"));
}

/*Styles the page dynamically*/
function style() {
    center($("#input"));
    center($("#relations"));
    center($("#buttons"));

    sizeMenu();

    if($(window).width() < 500) {
	$("#results").width($(window).width());
    }
    center($("#results"));
    $("#results").resize(function() {recenter();});
}

function center(obj) {
    var pageWidth = $(window).width();
    var inputMarginLeft = (pageWidth - obj.outerWidth()) / 2;
    obj.css("margin-left", inputMarginLeft);
}

function del () {
    var buttons = $("#relations input[type=radio]");
    for(var i = 0; buttons[i]; i++) {
	if(buttons[i].checked) {
	    var string = buttons[i].outerHTML.substring(37, buttons[i].outerHTML.length-2);
	}
    }

    deleteHelp(string);
}

function deleteHelp (name) {
    if(saved[name]) {
	delete saved[name];
    }

    if(localStorage.savedListNames) {
	var savedListNames = JSON.parse(localStorage.savedListNames);
	var index = savedListNames.indexOf(name);
	if(index > -1) {
	    savedListNames.splice(index, 1);
	    localStorage.removeItem(name);
	}
	localStorage.savedListNames = JSON.stringify(savedListNames);
    }

$("#relations").html( function (index, oldHTML) {
    var index = oldHTML.indexOf('val="'+name+'"');
    var start = index - 48 - name.length;
    var end = index + 17 + 2 * name.length;
    return oldHTML.substring(0, start) + oldHTML.substring(end+1, oldHTML.length);
});

    resizeRelations();
}

/*Loads the selected saved list into the current list, overwritng any existing data*/
function load () {
	var buttons = $("#relations span input[type=radio]");
    for (var i = 0; buttons[i]; i++) {
	if(buttons[i].checked) { 
	    var string = buttons[i].outerHTML.substring(37, buttons[i].outerHTML.length-2);
	}
    }

    loadHelp(string);
}

/*Same purpose as above, but takes name as a parameter so it can be used programatically*/
function loadHelp (name) {
	if(saved[name]) { 
		currentNodes = saved[name]["nodes"]; 
		currentEdges = saved[name]["edges"]; 
	} else {
		alert('Error: no graph found with the name "'+name+'". Please try again. [Error code 00001]');
	}

    	var inText = "";
    	for(var i in currentNodes) {
		inText += currentNodes[i].name + ": "
		for(var j in currentNodes[i].edges) {
			inText += currentNodes[i].edges[j].target.name + ", "; 
		
		}
		inText = inText.substring(0, inText.length-2)+"\n";
    	}
    	inText = inText.substring(0, inText.length-1);
    	$("#input").val(inText);
}


/*Saves the current data into the load list*/
function save () {
    $("#relButtons").children("button").prop("disabled",false);
    var name = $("#save").children("input[type=\"text\"]").val();
    name.trim();
    if(name == "") {
	alert("No name entered.");
    } else if(saved[name]) {
	alert("That name is already taken. Please choose a new one.");
    } else {
	saveHelp(name, currentNodes, currentEdges, true);
    }
    $("#save").children("input[type=\"text\"]").val("");
}

/*Saves the data passed in into the nodes list*/
function saveHelp (listName, nodeList, edgeList, addToSaveList) {
    if(saved[listName]) { return; }
    
    saved[listName] = [];
    saved[listName]["nodes"] = deepCopy(nodeList);
    saved[listName]["edges"] = deepCopy(edgeList);

    if(addToSaveList) {	
	if(localStorage.savedListNames) {
	    var savedListNames = JSON.parse(localStorage.savedListNames);
	} else {
	    var savedListNames = [];
	}
	
	savedListNames.push(listName);
	localStorage.savedListNames = JSON.stringify(savedListNames);
	localStorage.setItem(listName, print(saved[listName]["nodes"]));
    }

    $("#relations").html(function (index, oldHTML) {return oldHTML + '<span id="'+spaceless(listName)+'Span"><input type="radio" name="rels"val="'+listName+'">'+listName+"</input></span><br>"});

    resizeRelations();
}

function maxWidth(div, init) {
    var maxWid = init;
    for(var name in saved) {
	var child = div.children("span#"+spaceless(name)+"Span");
	if(child) {
	    var wid = child.width();
	    maxWid = findMax(maxWid, wid);
	}
    }
    return maxWid;
}

function totalHeight() {
    var div = $("#relations");
    var height = 0;
    for(var name in saved) {
	var child = div.children("span#"+spaceless(name)+"Span");
	if(child) {
	    height += child.height();
	}
    }
    return height;
}

function getSVGdimensions () {
    	var result = {width:0, height:0};
	var sideWidth = $("#relations").outerWidth(true);
    	result.width = $(document).width() - sideWidth - 20;

    	var topHeight = $("h1").outerHeight(true) + $("#menu").height() + $("footer").height() + 20;
    	result.height = $(document).height() - topHeight;
	return result;
}

function sizeMenu () {
   var width = $("a").outerWidth(true) 
	     + $("a + a").outerWidth(true)
	     + $("#selectedMenu").outerWidth(true);
   $("#menu").css("width", (width+20)+"px");
   center($("#menu"));
}

function resizeRelations () {
    var width = maxWidth($("#relations"),0) + $("#relButtons").width()+20;
    $("#relations").css("width", width+"px");

    var height = totalHeight();
    $("#relButtons").css("height",height+"px");
}

function graphTickFunction () {
	//Calculate positions of edges and nodes based on data
	d3EdgeSelection.attr("d", function(d) {
		var xLength = d.target.x - d.source.x;
		var yLength = d.target.y - d.source.y;
		var distance = Math.sqrt(xLength * xLength + yLength * yLength);
		var srcX = d.source.x + xLength / distance * 12; //HARDCODED VALUE
		var srcY = d.source.y + yLength / distance * 12; //HARDCODED VALUE
		var tarX = d.target.x - xLength / distance * 17; //HARDCODED VALUE
		var tarY = d.target.y - yLength / distance * 17; //HARDCODED VALUE
		return "M"+srcX+","+srcY+"L"+tarX+","+tarY;
	});
	d3NodeSelection.attr("transform", function(d) {
		return "translate ("+d.x+", "+d.y+")";
	});
}

function draw () {
	//use d3.enter() to initialize the things
	
	//HOTFIX: FIND ACTUAL ISSUE WHEN TIME
	currentNodes = currentNodes.filter(function(d) {return d!= undefined;});

	d3NodeSelection = d3NodeSelection.data(currentNodes, function(d) {return d.name;});
	d3EdgeSelection = d3EdgeSelection.data(currentEdges);

	d3EdgeSelection.enter().append("svg:path")
			       .attr("class", "edge")
	 		       .style("marker-end", "url(#end-arrow)");

	
	var g = d3NodeSelection.enter().append("svg:g");
	g.append("svg:circle")
	  .attr("class", "node")
	  .attr("r", 12); //HARD-CODED VALUE
	g.append("svg:text")
	  .attr("x", 0)
	  .attr("y", 4)
	  .attr("class", "name")
	  .text(function(d) {return d.name;});

	d3ForceReference.start();
}
