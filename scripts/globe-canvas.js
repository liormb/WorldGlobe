
var width = 660;
var height = 660;

var scal = 2.3;
var sens = 0.25;
var focused;

var projection = d3.geo.orthographic()
	.translate([width / 2, height / 2])
	.precision(.5)
	.rotate([0, -10, 0])
	.scale(width / scal)
	.clipAngle(90);

var graticule = d3.geo.graticule();
var path = d3.geo.path().projection(projection);

var canvas1 = d3.select('.globe-container').append('canvas');
var canvas2 = d3.select('.globe-container').append('canvas').attr('class', 'blur');
var canvas3 = d3.select('.globe-container').append('canvas');
var canvas4 = d3.select('.globe-container').append('canvas');

d3.selectAll('canvas')
	.attr('width', width)
	.attr('height', height);

var context1 = canvas1.node().getContext('2d');
var context2 = canvas2.node().getContext('2d');
var context3 = canvas3.node().getContext('2d');
var context4 = canvas4.node().getContext('2d');

var countryPath = d3.geo.path()
	.projection(projection)
	.context(context4);

d3.json("data/world-110m.json", function(error, world){
	var land = topojson.feature(world, world.objects.land);
	var countries = topojson.feature(world, world.objects.countries).features;
	var borders = topojson.feature(world, world.objects.countries);
	var grid = graticule();

	draw(land, borders, countries, grid);

	d3.selectAll('canvas')
		.call(d3.behavior.drag()
	  	.origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
	  	.on("drag", function() {
				var rotate = projection.rotate();
	      projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
	  		draw(land, borders, countries, grid);
	  	})
	  );
});

function draw(land, borders, countries, grid){
	context1.clearRect(0, 0, width, height);
	context2.clearRect(0, 0, width, height);
	context3.clearRect(0, 0, width, height);
	context4.clearRect(0, 0, width, height);

	projection.scale(width / scal).clipAngle(90);

	context1.beginPath();
	path.context(context1)({type: "Sphere"});
	context1.lineWidth = 3;
	context1.strokeStyle = "#000";
	context1.fillStyle = "#fff";
	context1.stroke();
	context1.fill();

	projection.scale(width / scal).clipAngle(90);

	context2.beginPath();
	path.context(context2)(land);
	context2.fillStyle = "rgba(0,0,0,.4)";
	context2.fill();

	context3.beginPath();
	path.context(context3)(grid);
	context3.lineWidth = .5;
	context3.strokeStyle = "rgba(0,0,0,.2)";
	context3.stroke();

	projection.scale(width / (scal-0.1)).clipAngle(106.3);

	context3.beginPath();
	path(land);
	context3.fillStyle = "#737368";
	context3.fill();

	projection.scale(width / (scal-0.1)).clipAngle(90);

	context3.beginPath();
  path(land);
  context3.fillStyle = "#dadac4";
  context3.fill();

  context4.beginPath();
	context4.strokeStyle = "#fff";
	context4.lineWidth = .5;
	countryPath(borders);
	context4.stroke();

	// country = countries[0];
 	// context4.beginPath();
 	// context4.fillStyle = "red";
 	// countryPath(country);
 	// context4.fill();
}

d3.select(self.frameElement).style("height", height + "px");
