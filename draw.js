/* function to set up  the drawing of NEW elements ENTERING the dataset */
var radius = d3.scale.sqrt()
    .domain([0, 700])
    .range([1, 15]);

function draw_enter(category_id){
  "use strict"; 
  var collection = category_map.get(category_id);
  var g = svg.select("#id"+category_id);

  var feature = g.selectAll("circle")
                .data(collection,function(d){
                  return d.id;
                });

  /* append svg circle for new elements in dataset */
  feature.enter()
  .append("circle").attr('id', function(d){
    return 'id'+d.id;
  })
  .attr("cx", function(d){
    return map.latLngToLayerPoint(d.point).x;
  })
  .attr("cy", function(d){
    return map.latLngToLayerPoint(d.point).y;
  })
  .on("click", view_relations)
  .append("title")
  .style("opacity", ".5");

  map.on("viewreset", update);
}
/* update drawing on ZOOM event and new rsvp object in dataset */
 function update() {
  "use strict";
  /*update circles positions*/

  var g = svg.selectAll("g");
  
  var nodes = g.selectAll("circle");

  var edges = g.selectAll("line");



  nodes
   .attr("cx", function(d){
      return map.latLngToLayerPoint(d.point).x;
      } )
    .attr("cy", function(d){
      return map.latLngToLayerPoint(d.point).y;
     } );


 }

/*update radius and tip on rsvp received */

function draw_onRsvp(id){
  "use strict";   

    var circle = d3.select("#id"+id);
    /*UPDATE TIP*/
    circle.select("title")
      .text(function(d) {
        var event = events_map.get(d.id);
        var date = new Date();
        return event.name
            + "\nRSVPs Number : " + event.rsvp_yes
            + "\nStart date : " + strftime('%F %R\n', new Date(d.time))
            + "\nColor : blue-->proposed || red-->upcoming";
      });

    blink_transition(id); //start blink transition on rsvp
}
/* blink events that received an RSVP */
  function blink_transition(id){
    "use strict";
     var circle = d3.select("#id"+id);

     circle.interrupt();

      circle
      .style("opacity", .9)
      .style("fill", "yellow")
      .transition()
        .ease('linear')
        .duration(500)
        .attr("r", function(d){
            var rsvps = events_map.get(d.id).rsvp_yes;
            return radius(rsvps)+5;
        })
        .each('start', function(d){
          d3.select(this)
          .on('mouseover', game);
        })
      .transition()
        .ease('linear')
        .duration(200)
        .attr("r", function(d){
            var rsvps = events_map.get(d.id).rsvp_yes;
            return radius(rsvps);
        })
        .each('end', function(d) {
          timeTransition(d.id);
          d3.select(this)
          .on('mouseover', null);
        });
        
  }

  function timeTransition(id){

    var date = new Date();

    var colours = ["blue","red"];

    var heatmapColour = d3.scale.pow(0.3)
    .domain([0,1])
    .range(colours);

     var circle = d3.select("#id"+id);
     circle
        .style("opacity", ".5") 
        .transition()
        .ease('linear')
        .duration(function(d) {
          return d.time-date.getTime();
        })
        .styleTween("fill", function(d) {
          return d3.interpolateRgb(heatmapColour(Math.exp((date.getTime()-d.time)/5e8)),"red");
        });

  }

  function draw_edges(edges) {   
    svg.select("#idEdges")
    .selectAll('line')
    .data(edges, function(d){
      return d.id;
    })
    .enter()
    .append('line');/*
    .attr({
    'x1': map.latLngToLayerPoint(event1.point).x,
    'y1': map.latLngToLayerPoint(event1.point).y,
    'x2': map.latLngToLayerPoint(event2.point).x,
    'y2': map.latLngToLayerPoint(event2.point).y,
    'stroke': 'green',
    'storke-width' : weight/10+'px'
    })*/
  }