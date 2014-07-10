/*Called on load, sets up the global namespace correctly*/
function editPageSetup () {
    var res = parse($("#input").val(), "\n");

    nodes = res["nodes"];
    edges = res["edges"];
    saved = [];

    if(typeof(String.prototype.trim) === "undefined") {
	    String.prototype.trim = function() {
            return String(this).replace(/^\s+|\s+$/g, ''); 
        };
    }

    if(!loadSaved()) {
	   addCompleteGraphs();
    }
    $("#relButtons").children("button").prop("disabled",false);
    style();
}


function drawPageSetup () {
    saved = [];
    loadSaved();
    var isInit = false;
    for(var res in saved) {
	isInit = true;
	nodes = saved[res]["nodes"];
	edges = saved[res]["edges"];
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
    resizeCanvas();
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
    var index = oldHTML.indexOf("val=\""+name+"\"");
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
    if(saved[name]) { nodes = saved[name]["nodes"]; edges = saved[name]["edges"]; }

    var inText = "";
    for(var i in nodes) {
	inText += nodes[i].val + ": "
	for(var j in nodes[i].edges) {
		inText += nodes[i].edges[j].end.val + ", "; 
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
	saveHelp(name, nodes, edges, true);
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

    $("#relations").html(function (index, oldHTML) {return oldHTML + "<span id=\""+spaceless(listName)+"Span\"><input type=\"radio\" name=\"rels\"val=\""+listName+"\">"+listName+"</input></span><br>"});

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

function resizeCanvas () {
    var canvas = $("#canvas");
    var sideWidth = $("#relations").outerWidth(true);
    var width = $(document).width() - sideWidth - 20;
    canvas.prop("width", width);

    var topHeight = $("h1").outerHeight(true) + $("#menu").height() + $("footer").height() + 20;
    var height = $(document).height() - topHeight;
    canvas.prop("height", height);
    canvas.css("margin", 0);
}

function sizeMenu () {
   var width = 2*$("a").outerWidth(true) + $("#selectedMenu").outerWidth(true);
   $("#menu").css("width", (width+20)+"px");
   center($("#menu"));
}

function resizeRelations () {
    var width = maxWidth($("#relations"),0) + $("#relButtons").width()+20;
    $("#relations").css("width", width+"px");

    var height = totalHeight();
    $("#relButtons").css("height",height+"px");
}
