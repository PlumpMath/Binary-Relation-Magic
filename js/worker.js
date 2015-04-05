/*Analyzes the input*/
function analyze() {
    var res = parse($("#input").val(), "\n");

    currentNodes = res["nodes"];
    currentEdges = res["edges"];
    
    var newHTML = "";

    var props = getProperties(currentNodes);

    for(var i in props) {
	newHTML += "It's "+props[i]+"<br>";
    }
    newHTML = newHTML.substring(0, newHTML.length-4);

    $("#results").html(newHTML);
}

function findMax(val1, val2) {
    return val1 > val2 ? val1 : val2;
}

/*Resets the current list, and the text onscreen*/
function reset() {
    if(saved["K1"]) {
	loadHelp("K1");
	$("#input").val("1: 1");
    } else {
	currentNodes = [];
	currentEdges = [];
	$("#input").val("");
    }
    
    $("#results").html("...");
}

/*Determines which properties the list has*/
function getProperties(list) {
    var properties = ["reflexive", "symmetric","antisymmetric","transitive","a one-to-one function", "a function"];
    
    for(var i in list) {
	var myNode = list[i];

	/*Reflexive check*/
	if(!contains(myNode.edges, currentEdges[nameEdge(myNode, myNode)])) {
	    var refInd = properties.indexOf("reflexive");
	    if(refInd > -1) { properties.splice(refInd,1); }
	}

	for(var j in myNode.edges) {
	    var otherNode = myNode.edges[j].target;

	    /*Symmetric check*/
	    if(!contains(otherNode.edges, currentEdges[nameEdge(otherNode, myNode)])) {
		var symInd = properties.indexOf("symmetric");
		if(symInd > -1) { properties.splice(symInd,1); }
	    }
	    
	    /*Antisymmetric check*/
	    if(otherNode != myNode && contains(otherNode.edges, currentEdges[nameEdge(otherNode, myNode)])) {
		var antiInd = properties.indexOf("antisymmetric");
		if(antiInd > -1) { properties.splice(antiInd,1); }
	    }

	    for(var k in otherNode.edges) {
		var thirdNode = otherNode.edges[k].target;
		
		/*Transitive check*/
		if(!contains(myNode.edges, currentEdges[nameEdge(myNode, thirdNode)])) {
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
    alert("adding complete graphs");
    for(var i = 1; i <= 10; i++) {
	var graph = {nodes:[], edges:[]};
	for(var j = 1; j <= i; j++) {
		graph["nodes"][j] = new Node(j);
	}
	for(var j = 1; j <= i; j++) {
		for(var k = 1; k <= i; k++) {
			var edge = new Edge(graph["nodes"][j], 
		 		 	    graph["nodes"][k]);
			graph["edges"].push(edge);
			graph["nodes"][j].addEdge(edge);
			graph["nodes"][k].addEnd(edge);
		}
	}

	saveHelp("K"+i, graph["nodes"], graph["edges"], true);
    }
}

function loadSaved () {
    //If there is no list of saved items, return false.
    if(!localStorage.savedListNames) {
	return false;
    }
    
    //Get the list of names
    var savedListNames = JSON.parse(localStorage.savedListNames);

    //Makes sure the list is non-empty before returning true.
    var result = false;
    for(var i in savedListNames) {
	result = true;
	var graphText = localStorage.getItem(savedListNames[i]);
	if(graphText) {
	    var graph = parse(graphText, "<br>");
	    saveHelp(savedListNames[i], graph["nodes"], graph["edges"], false);
	}
    }
    return result;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

function spaceless(string) {
    string = string.replace(/ /g, '_');
    return string;
}
