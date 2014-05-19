function test () {
    var ctx = $("canvas")[0].getContext("2d");

    var xCenter = 250;
    var yCenter = -500;
    var radLrg = 500;
    var x1 = 45;
    var y1 = -45;
    var x2 = 455;
    var y2 = -45;
    var rad = 20;
    
    var delX1 = xCenter - x1-rad;
    var delY1 = yCenter - y1;
    var delX2 = xCenter - x2+rad;
    var delY2 = yCenter - y2;

    var slope1 = delY1 / delX1;
    var slope2 = delY2 / delX2;
    var theta1 = Math.atan(slope1);
    var theta2 = Math.atan(slope2);

    
    ctx.beginPath();
    ctx.arc(xCenter, -yCenter, radLrg, Math.PI-theta1, -theta2);
    ctx.moveTo(x1+rad,-y1);
    ctx.arc(x1, -y1, rad, 0, 2 * Math.PI);
    ctx.moveTo(x2+rad, -y2);
    ctx.arc(x2, -y2, rad, 0, 2 * Math.PI);
    ctx.stroke();

}
