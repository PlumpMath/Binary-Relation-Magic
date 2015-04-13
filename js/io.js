/*Called on load, sets up the global namespace correctly*/
function editPageSetup () {
	
	//Load the default graph
	var inputText = $("#input").val();	
    	var graph = parse(inputText, "\n");

    	currentNodes = graph["nodes"];
d3ForceReference.start();
}
