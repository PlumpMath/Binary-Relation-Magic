QUnit.skip("Test descriptions", function(assert) {
	assert.expect(6)
	assert.ok(true, "OK checks if the first value is truthy");
	assert.deepEqual({['a','bed']:[1,2,3]}, {['a', 'bed']:[1,2,3]}, "Deep Equal checks that the objects are identical");
	assert.equal(1, "1", "Equal uses ==");
	assert.propEqual([1], {0:1}, "Prop equal uses === and checks that the properties are the same");
	assert.push(true, 0, "fish", "Push lets you define your own assertion and tell it the result");
	assert.strictEqual(1,2/2, "Strict equal uses ===");
});


node = new Node("node1"),
node2 = new Node("node2"),
node3 = new Node("node3");
edge = new Edge(node, node2),
edge2 = new Edge(node, node3)
edge3 = new Edge(node3, node2);
node.addEdge(edge);
node.addEdge(edge2);
node.addEdge(edge);
node3.addEdge(edge3);
node2.addEnd(edge);
node3.addEnd(edge2);
node2.addEnd(edge3);
node2.addEnd(edge);

//I need a circular-reference safe way to check list equality (unlike propEqual)
function checkListsAreEqual(actual, expected) {
	for(var i in actual) if(!contains(expected, actual[i])) return false;
	for(var i in expected) if(!contains(actual, expected[i])) return false;
	return true;
}

QUnit.test("Node/Edge test", function(assert) {
	assert.deepEqual(node.edges, [edge, edge2], "Check that node1 has the correct outbound edges. ");
	assert.deepEqual(node.ends, [], "Check that node1 has the correct inbound edges.");
	assert.deepEqual(node2.edges, [], "Check that node2 has the correct outbound edges");
	assert.deepEqual(node2.ends, [edge, edge3], "Check that node2 has the correct inbound edges");
	assert.deepEqual(node3.edges, [edge3], "Check that node3 has the correct outbound edges");
	assert.deepEqual(node3.ends, [edge2], "Check that node3 has the correct inbound edges");
});

QUnit.test("Contains function test", function(assert) {
	assert.ok(contains(node.edges, edge), "node1.edges should contain edge1");
	assert.ok(contains(node2.ends, edge3), "node2.ends should contain edge3");
	assert.ok(contains([1,4,"hello",true,{foo:1,bar:"fum"}], true), "checking a random element of a random list");
	assert.ok(!contains(node.ends, edge), "node1.ends should NOT contain edge1");
	assert.ok(!contains(node2.edges, edge3), "node2.edges should NOT contain edge3");
	assert.ok(!contains([1,4,"hello",true,{foo:1,bar:"fum"}], "true"), "random list should NOT contain \"true\" when it has true as an element");
	assert.ok(!contains([1,4,"hello",true,{foo:1,bar:"fum"}], "4"), "random list shouldn't contain string of digit");
});

QUnit.test("Graph parsing", function(assert) {
	var graph = parse("node1:node2,node3#node3:node2", '#');
	console.log(graph);
	var actual = graph["nodes"], expected = [node, node2, node3];
	assert.push(checkListsAreEqual(actual, expected), actual, expected, "parsing a graph should yield the same nodes as when I manually add the elements");
	var actual = graph["edges"], expected = [edge, edge2, edge3];
	assert.push(checkListsAreEqual(actual, expected), actual, expected, "parsing a graph should yield the same edges as when I manually add the elements");
});

QUnit.test("Graph stringification", function(assert) {
	var actual = parse(print([node, node2, node3]), "<br>"), expected = [node, node2, node3];
	assert.push(checkListsAreEqual(actual, expected), actual, expected, "parsing the printing of a nodelist should give a functionally equivalent node list");
});

QUnit.test("naming consistency", function(assert) {
	assert.deepEqual(nameEdge(edge.source, edge.target), nameEdge(node, node2), "naming should be consistent given the same start/end nodes");
});

