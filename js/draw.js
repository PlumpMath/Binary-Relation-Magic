/*Draws the graph*/
function draw () {
    var ctx = $("#canvas")[0].getContext("2d");
    ctx.clearRect(0,0,$("#canvas").width(),$("#canvas").height());
    drawNodes(ctx);
    drawEdges(ctx);
}

/*Determines what edges need to be drawn and calls the appropriate helper methods*/
function drawEdges (ctx) {
    for(var i in edges) {
	var edge = edges[i];
	var myInd = edge.start.index;
	var otherInd = edge.end.index;
	
	if(myInd === otherInd) {
	    drawSelfLoop(ctx, edge.start);
	} else if((myInd - otherInd) % 2 == 0) {
	    drawCurvedEdge(ctx, edge);
	} else {
	    drawCrossEdge(ctx, edge);
	}
    }
}

/*Draws edges that go from the top row to the bottom row, or visa versa*/
function drawCrossEdge(ctx, edge) {
    ctx.beginPath();
    var slope = (edge.start.yCoord-edge.end.yCoord)/(edge.start.xCoord-edge.end.xCoord);
    var theta = Math.atan(slope);
    var smallerX = edge.start.xCoord < edge.end.xCoord ? edge.start : edge.end;
    var largerX  = edge.start.xCoord < edge.end.xCoord ? edge.end : edge.start;

    var ang = theta;

    var xStart = smallerX.xCoord + 20 * Math.cos(ang);
    var yStart = smallerX.yCoord + 20 * Math.sin(ang);
    ang = Math.PI + theta
    var xEnd = largerX.xCoord + 20 * Math.cos(ang);
    var yEnd = largerX.yCoord + 20 * Math.sin(ang);

    ctx.moveTo(xStart, -yStart);
    ctx.lineTo(xEnd, -yEnd);
    ctx.stroke();

    var otherEdge = edges[nameEdge(edge.end, edge.start)];

    if(!contains(edge.end.edges, otherEdge)) {
	var big = edge.start.index > edge.end.index;
	
	var xContact = (edge.start.xCoord + edge.end.xCoord + edge.end.xCoord) / 3;
	var yContact = edge.start.yCoord + slope * (xContact - edge.start.xCoord);
	
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
function drawCurvedEdge(ctx, edge) {
    ctx.beginPath();
    if (edge.start.xCoord < edge.end.xCoord) {
	var smallX = edge.start;
	var largeX = edge.end;
    } else { 
	var smallX = edge.end;
	var largeX = edge.start;
    }
    
    var xCenter = (edge.start.xCoord + edge.end.xCoord) / 2;
    if(edge.start.index % 2 === 1) { var yCenter = edge.start.yCoord - 500; }
    else { var yCenter = edge.start.yCoord + 500; }

    var radius = Math.sqrt(500*500+(xCenter - edge.start.xCoord)*(xCenter - edge.start.xCoord));
    var rad = 20;

    var angle1 = Math.PI + Math.atan((yCenter - largeX.yCoord) / (xCenter - largeX.xCoord + rad));
    var angle2 = Math.atan((yCenter - smallX.yCoord) / (xCenter - smallX.xCoord - rad));

    if(edge.start.index % 2 === 1) { ctx.arc(xCenter, -yCenter, radius, angle1, angle2); } 
    else { ctx.arc(xCenter, -yCenter, radius, angle2, angle1); }
    ctx.stroke();
    
    var otherEdge = edges[nameEdge(edge.end, edge.start)];

    if(!contains(edge.end.edges, otherEdge)) {
	var big = edge.start.index > edge.end.index;
	
	var xContact = xCenter;
	if(edge.start.index % 2 === 1) { var yContact = yCenter + radius; }
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

/*Draws self loops*/
function drawSelfLoop(ctx, myNode) {
    var xCen = myNode.xCoord + 20;
    var yCen = myNode.yCoord + 20;
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
    var width = $("#canvas").prop("width");
    var maxNodes = Math.floor((width-20)/100);

    var leng = nodes.length;
    if(leng > maxNodes) {
	leng = maxNodes;
    } 

    var index = 1;
    for(var i in nodes) {
	if(index > maxNodes) {
	    break;
	} 

	nodes[i].xCoord = 100*(index-1)+25;
	/*Coordinates are calculated in standard cartesian plane (quadrant 4) and then the y-values are inverted just before drawing*/
	nodes[i].yCoord = index % 2 == 1 ? -150 : -250; 

	nodes[i].index = index;

	ctx.beginPath();
	ctx.arc(nodes[i].xCoord, -nodes[i].yCoord, 20, 0, 2*Math.PI);
	ctx.stroke();
	ctx.font = "12px Verdana";
	ctx.fillText(nodes[i].val,nodes[i].xCoord-4,-nodes[i].yCoord+3);
	
	index++;
    }
}
