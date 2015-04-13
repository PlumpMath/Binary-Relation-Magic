QUnit.skip("Test descriptions", function(assert) {
	assert.expect(3)
	assert.ok(true, "OK checks if the first value is truthy");
	assert.deepEqual({[1,2,3]}, {[1,2,3]}, "Deep Equal checks that the objects are identical");
	assert.equal(1, "1", "Equal uses ==");
	assert.propEqual([1], {0:1}, "Prop equal uses === and checks that the properties are the same");
	assert.push(true, 0, "fish", "Push lets you define your own assertion and tell it the result");
	assert.strictEqual(1,2/2, "Strict equal uses ===");
});

QUnit.test("Node/Edge test", function(assert) {
	var node = new Node("node1"),
	    node2 = new Node("node2"),
	    node3 = new Node("node3");
	var edge = new Edge(node, node2),
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
	assert.deepEqual(node.edges, [edge, edge2], "Check that node1 has the correct outbound edges. ");
	assert.deepEqual(node.ends, [], "Check that node1 has the correct inbound edges.");
	assert.deepEqual(node2.edges, [], "Check that node2 has the correct outbound edges");
	assert.deepEqual(node2.ends, [edge, edge3], "Check that node2 has the correct inbound edges");
	assert.deepEqual(node3.edges, [edge3], "Check that node3 has the correct outbound edges");
	assert.deepEqual(node3.ends, [edge2], "Check that node3 has the correct inbound edges");
});
