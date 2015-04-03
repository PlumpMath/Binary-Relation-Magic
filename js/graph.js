/*Constructor for a Node object*/
function Node(value) {
    this.val = value;
    this.edges = [];
    this.ends = [];
    this.addEdge = function (newEdge) {
	if(contains(this.edges, newEdge)) {
	    return;
	} else {
	    this.edges.push(newEdge);
	}
    };
    this.addEnd = function (newEnd) {
	if(contains(this.ends, newEnd)) {
	    return;
	} else {
	    this.ends.push(newEnd);
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
    for(var i = 0; i < list.length;i++) {
	if(list[i] === element)
	    return true;
    } 
    return false;
}

/*Returns a string representation of nodeList, in the same format as it would be input in*/
function print (nodeList) {
    var result = "";
    for(var i in nodeList) {
	result += nodeList[i].val + ": ";
	for(var j in nodeList[i].edges) {
	    result += nodeList[i].edges[j].end.val + ",";
	}
	result = result.substring(0,result.length-1);
	result += "<br>";
    }
    result = result.substring(0,result.length-4);
    return result;
}

/*Parses an input string into a nodeList and edgeList*/
function parse (input, delim) {
    var nodeList = [];
    var edgeList = [];

    var lines = input.split(delim);
    
    for(var i in lines) {
	var array = lines[i].split(":");
	var startPt = array[0].trim();
	if(array[1]) {
	    var array2 = array[1].split(",");
	    for(var z in array2) { array2[z] = array2[z].trim(); }
	} else {
	    array2 = [];
	}

	var startNode = nodeList[startPt];
	if(!startNode) {
	    startNode = new Node(startPt);
	    nodeList[startPt] = startNode;
	}

	for(var j in array2) {
	    var endPt = array2[j].trim();
	    var endNode = nodeList[endPt];
	    if(!endNode) {
		endNode = new Node(endPt);
		nodeList[endPt] = endNode;
	    }

	    var edgeName = nameEdge(startNode, endNode);
	    var edge = edgeList[edgeName];
	    if(!edge) {
		edge = new Edge(startNode, endNode);
		edgeList[edgeName] = edge;
	    } else {
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
    return "("+startNode.val+","+endNode.val+")";
}
