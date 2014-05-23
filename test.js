function test () {
    var nodes = [];

    for(var i = 1; i <= 5; i++) {
	nodes[i] = new Node(i);
    }
    
    for(var i = 1; i <= 5; i++) {
	for(var j = 1; j <= 5; j++) {
	    var edge = new Edge(nodes[i], nodes[j]);
	    nodes[i].addEdge(edge);
	    nodes[j].addEnd(edge);
	}
    }

    $("#par").html(print(nodes));
}
