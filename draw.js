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
			var otherNode = myNode.edges[j].end;
			
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

	var otherEdge = edges[nameEdge(otherNode, myNode)];

    if(!contains(otherNode.edges, otherEdge)) {
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
