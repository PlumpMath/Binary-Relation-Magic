/*Analyzes the input*/
function analyze() {
    var res = parse($("#input").val());

    nodes = res["nodes"];
    edges = res["edges"];
    
    var newHTML = "";// print(nodes);

    var props = getProperties(nodes);
    
    for(var i in props) {
	newHTML += "<br>It's "+props[i];
    }

    $("#results").html(newHTML);
}

/*Called on load, sets up the global namespace correctly*/
function setup () {
    nodes = [];
    edges = [];
    saved = [];

    if(typeof(String.prototype.trim) === "undefined") {
	String.prototype.trim = function() { return String(this).replace(/^\s+|\s+$/g, ''); };
    }

    addCompleteGraphs();
}

/*Loads the selected saved list into the current list, overwritng any existing data*/
function load () {
    var buttons = $("input[type=radio]");
    for (var i = 0; buttons[i]; i++) {
	if(buttons[i].checked) { 
	    var string = buttons[i].outerHTML.substring(37, buttons[i].outerHTML.length-2);
	}
    }

    loadHelp(string);
}

/*Same function as above, but takes name as a parameter so it can be used programatically*/
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
    $("#relations").children("button").prop("disabled",false);
    var name = $("#save").children("input[type=\"text\"]").val();
    saveHelp(name, nodes, edges);
}

/*Saves the data passed in into the nodes list*/
function saveHelp (listName, nodeList, edgeList) {
    saved[listName] =[];
    saved[listName]["nodes"] = deepCopy(nodeList);
    saved[listName]["edges"] = deepCopy(edgeList);

    $("#relations").html(function (index, oldHTML) {return oldHTML + "<input type=\"radio\" name=\"rels\"val=\""+listName+"\">"+listName+"</input><br />"});
}

/*Resets the current list, and the text onscreen*/
function reset() {
    nodes = [];
    edges = [];
    $("#results").html("...");
    $("#input").val("1: 1");
}

/*Determines which properties the list has*/
function getProperties(list) {
    var properties = ["reflexive", "symmetric","antisymmetric","transitive","a one-to-one function", "a function"];
    
    for(var i in list) {
	var myNode = list[i];

	/*Reflexive check*/
	if(!contains(myNode.edges, myNode)) {
	    var refInd = properties.indexOf("reflexive");
	    if(refInd > -1) { properties.splice(refInd,1); }
	}

	for(var j in myNode.edges) {
	    var otherNode = myNode.edges[j].end;

	    /*Symmetric check*/
	    if(!contains(otherNode.edges, myNode)) {
		var symInd = properties.indexOf("symmetric");
		if(symInd > -1) { properties.splice(symInd,1); }
	    }
	    
	    /*Antisymmetric check*/
	    if(otherNode != myNode && contains(myNode.ends, otherNode)) {
		var antiInd = properties.indexOf("antisymmetric");
		if(antiInd > -1) { properties.splice(antiInd,1); }
	    }

	    for(var k in otherNode.edges) {
		var thirdNode = otherNode.edges[k];
		
		/*Transitive check*/
		if(!contains(myNode.edges, thirdNode)) {
		    var tranInd = properties.indexOf("transitive");
		    if(tranInd > -1) { properties.splice(tranInd,1); }
		}
	    }
	}
	
	/*One-to-One check*/
	if(myNode.ends.length != 1) {
	    var oneInd = properties.indexOf("a one-to-one function");
	    if(oneInd > -1) { properties.splice(oneInd,1); }
	}
	
	/*Function check*/
	if(myNode.edges.length != 1) {
	    var funInd = properties.indexOf("a function");
	    if(funInd > -1) { properties.splice(oneInd, 1); }
	    var oneInd = properties.indexOf("a one-to-one function");
	    if(oneInd > -1) { properties.splice(oneInd,1); }
	}
    }

    var oneInd = properties.indexOf("a one-to-one function");
    if(oneInd > -1) {
	var funInd = properties.indexOf("a function");
	properties.splice(funInd, 1);
    }
    
    return properties;
}

/*Creates a functionally different copy of the array (all elements are still references)*/
function deepCopy(array) {
    var result = [];
    for(var i in array) {
	result[i] = array[i];
    }
    return result;
}

/*Creates the complete graphs from K1 to K5 and adds them to the load list*/
function addCompleteGraphs() {
    for(var i = 1; i <= 5; i++) {
	var string = "";
	for(var j = 1; j <= i; j++) {
	    string += j+":";
	    for(var k = 1; k <= i; k++) {
		string += k+",";
	    }
	    string = string.substring(0, string.length-1)+"\n";
	}
	string = string.substring(0,string.length-1);

	var graph = parse(string);
	saveHelp("K"+i, graph["nodes"], graph["edges"]);

    }

    $("#relations").children("button").prop("disabled",false);
}
