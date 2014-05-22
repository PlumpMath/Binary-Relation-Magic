function Node(value) {
    this.val = value;
    this.edges = [];
    this.ends = [];
    this.addEdge = function (newEdge) {
	if(contains(this.edges, newEdge)) {
	    return;
	} else {
	    this.edges.push(newEdge);
//	    this.edges.sort(function (a,b){return a.val > b.val;});
	}
    };
    this.addEnd = function (newEnd) {
	if(contains(this.ends, newEnd)) {
	    return;
	} else {
	    this.ends.push(newEnd);
//	    this.ends.sort(function (a,b){return a.val > b.val;});
	}
    };
}

function Edge(startNode, endNode) {
    this.start = startNode;
    this.end = endNode;
    this.directed = true;
    this.multiplicity = 1;
}

function contains (list, element) { 
    if(!list) {
	console.log("List is undefined");
    }
    for(var i = 0; i < list.length;i++) {
	if(list[i]===element)
	    return true;
    } 
    return false;
}

function print (nodeList) {
    var result = "";
    for(var i in nodeList) {
	result += nodeList[i].val + ": [";
	for(var j in nodeList[i].edges) {
		result += nodeList[i].edges[j].endNode.val + ",";
	}
	result += "] [";
	
	for(var k in nodeList[i].ends) {
		result += nodeList[i].ends[k].startNode.val + ",";
	}
	result += "]<br>";
    }
    return result;
}

function parse (input) {
    var nodeList = [];
    var edgeList = [];

    var lines = input.split("\n");
    
//    for(var i = 0; i < lines.length; i++) {
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

//	for(var j = 0; j < array2.length; j++) {
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

function nameEdge(startNode, endNode) {
    return "("+startNode.val+","+endNode.val+")";
}
