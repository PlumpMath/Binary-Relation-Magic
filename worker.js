/*Analyzes the input*/
function analyze() {
    nodes = [];

    parse();
    
    var newHTML = print(nodes);
    
    var props = getProperties(nodes);
    
    for(var i in props) {
	newHTML += "<br>It's "+props[i];
    }

    $("#results").html(newHTML);
}

/*Draws the graph*/
function draw () {
    var ctx = $("#canvas")[0].getContext("2d");
    ctx.clearRect(0,0,$("#canvas").width(),$("#canvas").height());
    drawNodes(ctx);
    drawEdges(ctx);
}

/*Determines what edges need to be drawn and calls the appropriate helper methods*/
function drawEdges (ctx) {
    for(var i in nodes) {
	var myNode = nodes[i];
	for(var j in myNode.edges) {
	    var otherNode = myNode.edges[j];
	    
	    var myVal = myNode.index;
	    var otherVal = otherNode.index;

	    if(myVal === otherVal) {
		drawSelfLoop(ctx, myVal);		
	    } else if((myVal - otherVal) % 2 == 0) {
		drawCurvedEdge(ctx, myNode, otherNode);
	    } else {
		drawCrossEdge(ctx, myNode, otherNode);
	    }
	}
    }
}

/*Draws edges that go from the top row to the bottom row, or visa versa*/
function drawCrossEdge(ctx, myNode, otherNode) {
    ctx.beginPath();
    var myVal = myNode.index;
    var otherVal = otherNode.index;
    var slope = (ys[myVal]-ys[otherVal])/(xs[myVal]-xs[otherVal]);
    var theta = Math.atan(slope);
    var smallerX = xs[myVal] < xs[otherVal] ? myVal : otherVal;
    var largerX  = xs[myVal] < xs[otherVal] ? otherVal : myVal;

    var ang = theta;

    var xStart = xs[smallerX] + 20 * Math.cos(ang);
    var yStart = ys[smallerX] + 20 * Math.sin(ang);
    ang = Math.PI + theta
    var xEnd = xs[largerX] + 20 * Math.cos(ang);
    var yEnd = ys[largerX] + 20 * Math.sin(ang);

    ctx.moveTo(xStart, -yStart);
    ctx.lineTo(xEnd, -yEnd);
    ctx.stroke();


    if(!contains(otherNode.edges, myNode)) {
	var big = myVal > otherVal;
	
	var xContact = (xs[myVal] + xs[otherVal] + xs[otherVal]) / 3;
	var yContact = ys[myVal] + slope * (xContact - xs[myVal]);
	
	var thetaA = Math.atan(slope);
	if(!big) { thetaA -= 2 * Math.PI / 3; }
	var thetaB = (thetaA - Math.PI/ 6);

	var xEnd1 = xContact + 15 * Math.cos(thetaB);
	var yEnd1 = yContact + 15 * Math.sin(thetaB);

	if(!big) { var thetaC = thetaB - Math.PI / 3; }
	else { var thetaC = thetaB + Math.PI / 3; }

	var xEnd2 = xContact + 15 * Math.cos(thetaC);
	var yEnd2 = yContact + 15 * Math.sin(thetaC);

	ctx.beginPath();
	ctx.moveTo(xContact, -yContact);
	ctx.lineTo(xEnd1, -yEnd1);
	ctx.moveTo(xContact, -yContact);
	ctx.lineTo(xEnd2, -yEnd2);
	ctx.stroke();
    }
}

/* Draws edges between nodes in the same row */
function drawCurvedEdge(ctx, myNode, otherNode) {
    ctx.beginPath();
    var myVal = myNode.index;
    var otherVal = otherNode.index;
    if (xs[myVal] < xs[otherVal]) {
	var smallX = myVal
	var largeX = otherVal
    } else { 
	var smallX = otherVal;
	var largeX = myVal;
    }
    
    var xCenter = (xs[myVal] + xs[otherVal]) / 2;
    if(myVal % 2 === 1) { var yCenter = ys[myVal] - 500; }
    else { var yCenter = ys[myVal] + 500; }

    var radius = Math.sqrt(500*500+(xCenter - xs[myVal])*(xCenter - xs[myVal]));
    var rad = 20;

    var angle1 = Math.PI + Math.atan((yCenter - ys[largeX]) / (xCenter - xs[largeX] + rad));
    var angle2 = Math.atan((yCenter - ys[smallX]) / (xCenter - xs[smallX] - rad));

    if(myVal % 2 === 1) { ctx.arc(xCenter, -yCenter, radius, angle1, angle2); } 
    else { ctx.arc(xCenter, -yCenter, radius, angle2, angle1); }
    ctx.stroke();
    
    if(!contains(otherNode.edges, myNode)) {
	var big = myVal > otherVal;
	
	var xContact = xCenter;
	if(myVal % 2 === 1) { var yContact = yCenter + radius; }
	else { var yContact = yCenter - radius; }

	var xOther = xContact + (big ? 12 : -12);
	var yOther = yContact - 9;

	ctx.beginPath();
	ctx.moveTo(xContact, -yContact);
	ctx.lineTo(xOther, (-yOther));
	ctx.moveTo(xContact, -yContact);
	ctx.lineTo(xOther, -(yOther + 18));
	ctx.stroke();
    }
}

/*Draws edge between nodes in bottom row (to be combined with drawOddEdge)*/
function drawEvenEdge(ctx, myNode, otherNode) {
    ctx.beginPath();
    var myVal = myNode.index;
    var otherVal = otherNode.index;

    var xCenter = (xs[myVal] + xs[otherVal])/2;
    var yCenter = ys[myVal] - 500;
    var radius = Math.sqrt(500*500+(xCenter - xs[myVal])*(xCenter - xs[myVal]));
    var angle1 = Math.PI/2 - Math.acos(500/(radius-5));
    var angle2 = Math.PI/2 + Math.acos(500/(radius-5));
    ctx.arc(xCenter, -yCenter, radius, angle1, angle2);
    ctx.stroke();
    
    if(!contains(otherNode.edges, myNode)) {
	var big = myVal > otherVal;
	
	var xContact = xCenter;
	var yContact = yCenter + radius;
			
	var xOther = xContact + (big ? 12 : -12);
	var yOther = yContact - 9;
	
	ctx.moveTo(xContact, -yContact);
	ctx.lineTo(xOther, -yOther);
	ctx.moveTo(xContact, -yContact);
	ctx.lineTo(xOther, -(yOther + 18));
	ctx.stroke();
    }
}

/*Draws self loops*/
function drawSelfLoop(ctx, myVal) {
    var xCen = xs[myVal] + 20;
    var yCen = ys[myVal] + 20;
    var rad = 15;
    var theta = Math.PI / 3;
    var xContact = xCen + rad * Math.cos(theta);
    var yContact = yCen + rad * Math.sin(theta);

    var tanSlope = -1/Math.atan(theta);
    var phi = Math.tan(tanSlope);
    var phiA = phi + Math.PI / 12;
    var phiB = phiA - 5*Math.PI / 12;

    var xEnd = xContact + rad * Math.cos(phiA);
    var yEnd = yContact + rad * Math.sin(phiA);

    var xEnd2 = xContact + rad * Math.cos(phiB);
    var yEnd2 = yContact + rad * Math.sin(phiB);

    ctx.beginPath();
    ctx.arc(xCen, -yCen, rad, -Math.PI, Math.PI/2);
    ctx.moveTo(xContact, -yContact);
    ctx.lineTo(xEnd, -yEnd);
    ctx.moveTo(xContact, -yContact);
    ctx.lineTo(xEnd2, -yEnd2);
    ctx.stroke();
}

/*Draws the nodes*/
function drawNodes (ctx) {
    var leng = nodes.length;
    if(leng > 5) {
	leng = 5;
    } 

    xs = [];
    ys = [];

    var index = 1;
    for(var i in nodes) {
	if(index > 5) {
	    break;
	} 
	xs[index] = 100*(index)+50*(index-1);

	//Coordinates are calculated in standard cartesian plane (quadrant 4) and then the y-values are inverted just before drawing
	ys[index] = index % 2 == 1 ? -100 : -200; 
	nodes[i].index = index;

	ctx.beginPath();
	ctx.arc(xs[index], -ys[index], 20, 0, 2*Math.PI);
	ctx.stroke();
	ctx.font = "12px Verdana";
	ctx.fillText(nodes[i].val,xs[index]-4,-ys[index]+3);
	
	index++;
    }
}



function setup () {
    nodes = [];
    saved = [];

    if(typeof(String.prototype.trim) === "undefined")
    {
	String.prototype.trim = function() 
	{
            return String(this).replace(/^\s+|\s+$/g, '');
	};
    }
}

function load () {
    var buttons = $("input[type=radio]");
    for (var i = 0; buttons[i]; i++) {
	if(buttons[i].checked) { 
	    var string = buttons[i].outerHTML.substring(37, buttons[i].outerHTML.length-2);
	}
    }
    
    if(saved[string]) { nodes = saved[string]; }

    var inText = "";
    for(var i in nodes) {
	console.log(nodes[i].val);
	inText += nodes[i].val + ": "
	for(var j in nodes[i].edges) {
		inText += nodes[i].edges[j].val + ", "; 
	}
	inText = inText.substring(0, inText.length-2)+"\n";
    }
    inText = inText.substring(0, inText.length-1);
    $("#input").val(inText);
    console.log(inText);
}

function save () {
    $("#relations").children("button").prop("disabled",false);
    var name = $("#save").children("input[type=\"text\"]").val();
    saved[name] = deepCopy(nodes);

    $("#relations").html(function (index, oldHTML) {return oldHTML + "<input type=\"radio\" name=\"rels\"val=\""+name+"\">"+name+"</input><br />"});
}

function print (list) {
    var result = "";
    for(var i in list) {
	result += list[i].val + ": [";
	for(var j in list[i].edges) {
		result += list[i].edges[j].val + ",";
	}
	result += "] [";
	
	for(var k in list[i].ends) {
		result += list[i].ends[k].val + ",";
	}
	result += "]<br>";
    }
    return result;
}

function reset() {
    nodes = [];
    $("#results").html("...");
    $("#input").html("1: 1");
}

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
	    var otherNode = myNode.edges[j];

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

function parse () {
    var input = $("#input").val();

    var lines = input.split("\n");
    
    for(var i = 0; i < lines.length; i++) {
	var array = lines[i].split(":");
	var startPt = array[0].trim();
	if(array[1]) {
	    var array2 = array[1].split(",");
	} else {
	    array2 = [];
	}

	var startNode = nodes[startPt];
	if(!startNode) {
	    startNode = new Node(startPt);
	    nodes[startPt] = startNode;
	}

	for(var j = 0; j < array2.length; j++) {
	    var endPt = array2[j].trim();
	    var endNode = nodes[endPt];
	    if(!endNode) {
		endNode = new Node(endPt);
		nodes[endPt] = endNode;
	    }
	    
	    startNode.addEdge(endNode);
	    endNode.addEnd(startNode);
	}
    }
}

function contains (list, element) { 
    for(var i = 0; i < list.length;i++) {
	if(list[i]===element)
	    return true;
    } 
    return false;
}

function Node(value) {
    this.val = value;
    this.edges = [];
    this.ends = [];
    this.addEdge = function (newEdge) {
	if(contains(this.edges, newEdge)) {
	    return;
	} else {
	    this.edges.push(newEdge);
	    this.edges.sort(function (a,b){return a.val > b.val;});
	}
    };
    this.addEnd = function (newEnd) {
	if(contains(this.ends, newEnd)) {
	    return;
	} else {
	    this.ends.push(newEnd);
	    this.ends.sort(function (a,b){return a.val > b.val;});
	}
    };
}

function deepCopy(array) {
    var result = [];
    for(var i in array) {
	result[i] = array[i];
    }
    return result;
}
