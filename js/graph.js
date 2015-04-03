/*Constructor for a Node object*/
function Node(_name) {
    this.name = _name;
    this.edges = []; //Outbound edges
    this.ends = []; //Inbound edges
    this.addEdge = function (newEdge) {
	if(contains(this.edges, newEdge)) {
	    return false;
	} else {
	    this.edges.push(newEdge);
	    return true;
	}
    };
    this.addEnd = function (newEnd) {
	if(contains(this.ends, newEnd)) {
	    return false;
	} else {
	    this.ends.push(newEnd);
	    return true;
	}
    };
}

/*Constructor for an Edge object*/
function Edge(startNode, endNode) {
    this.source = startNode;
    this.target = endNode;
    this.directed = true;
    this.multiplicity = 1;
}

/*Checks if an element is contained in the given list*/
function contains (list, element) { 
    if(!list) {
	console.log("List is undefined");
    }
    for(var i = 0; i < list.length;++i) {
	if(list[i] === element)
	    return true;
    } 
    return false;
}

/*Returns a string representation of nodeList, in the same format as it would be input in*/
function print (nodeList) {
    var result = "";
    for(var i in nodeList) {
	result += nodeList[i].name + ": ";
	for(var j in nodeList[i].edges) {
	    result += nodeList[i].edges[j].end.name + ",";
	}
	result = result.substring(0,result.length-1);
	result += "<br>";
    }
    result = result.substring(0,result.length-4);
    return result;
}

/*Parses an input string into a nodeList and edgeList*/
function parse (inputText, delimiter) {
    var nodeList = [];
    var edgeList = [];

    var lines = inputText.split(delimiter);
    
    //For each separate sentence of the input, parse it into the nodes and edges declared
    for(var i in lines) {
	//The source node will always be before a colon, and the destination(s) will be after
	var array = lines[i].split(":");
	var startPt = array[0].trim();
	if(array[1]) {
	    //Destination nodes are comma-separated
	    var array2 = array[1].split(",");
	    for(var z in array2) { array2[z] = array2[z].trim(); }
	} else {
	    array2 = [];
	}

	var startNode = nodeList[startPt];
	//If our source node does not yet exist, initialize it
	if(!startNode) {
	    startNode = new Node(startPt);
	    nodeList[startPt] = startNode;
	}

	//For each destination node, add an edge and update source.edges and destination.ends
	for(var j in array2) {
	    var endPt = array2[j].trim();
	    var endNode = nodeList[endPt];
	    //If our destination node doesn't exist, then initialize it
	    if(!endNode) {
		endNode = new Node(endPt);
		nodeList[endPt] = endNode;
	    }

	    //Make the edge
	    var edgeName = nameEdge(startNode, endNode);
	    var edge = edgeList[edgeName];
	    if(!edge) {
		edge = new Edge(startNode, endNode);
		edgeList[edgeName] = edge;
	    } else {
	    //If it already exists, increase the multiplicity.
		edge.multiplicity++;
	    }
	    startNode.addEdge(edge);
	    endNode.addEnd(edge);
	}
    }
    var result = [];
    result["nodes"] = nodeList;
    result["edges"] = edgeList;
    return result;
}

/*Consistently names edges based on starting and ending nodes*/
function nameEdge(startNode, endNode) {
    return "("+startNode.name+","+endNode.name+")";
}
