function draw() {
    var svg = $("#mySVG");
    var circle = $("<circle>", {cx:100, cy:100, r:80, stroke:"black", stroke-width:3, fill:"red"});
    svg.append(circle);
}
