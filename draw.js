/* function to set up  the drawing of NEW elements ENTERING the dataset */
var radius = d3.scale.sqrt()
    .domain([0, 700])
    .range([1, 15]);

function draw_event(event){
  "use strict";

  var point = event.point;
  var circle = L.circleMarker([point.lat, point.lng], radius(event.rsvp_yes)).addTo(map); 
 //circle.id = "id"+event.event_id;

  d3.select(circle['_path'])
  .datum(event)
  .attr('id', 'id'+event.event_id)
  .on("click", view_relations)
  .append("title");

  event2circle.set(event.event_id, circle);
}

/* update edges drawing on ZOOM */
 function update() {
  "use strict"; 

  var edges = d3.selectAll("line");
 
  edges
    .attr('x1', function(d){
      return map.latLngToLayerPoint(d.point1).x;
    })
    .attr('y1', function(d){
      return map.latLngToLayerPoint(d.point1).y;
    })
    .attr('x2', function(d){
      return map.latLngToLayerPoint(d.point2).x;
    })
    .attr('y2', function(d){
      return map.latLngToLayerPoint(d.point2).y;
    });

 }

/*update radius and tip on rsvp received */

function draw_onRsvp(id){
  "use strict";   

    var circle = d3.select("#id"+id);
    /*UPDATE TIP*/
    circle.select("title")
      .text(function(d) {
        var event = events_map.get(d.event_id);
        var date = new Date();
        return event.name
            + "\nRSVPs Number: " + event.rsvp_yes
            + "\nStart date: " + strftime('%F %R', new Date(d.time))
            + "\nGroup name: " + event.group_urlname
            + "\nColor: Blue-->Proposed || Red-->Upcoming";
      });

    blink_transition(id); //start blink transition on rsvp
}
/* blink events that received an RSVP */
  function blink_transition(id){
    "use strict";
     var circle = d3.select("#id"+id);

     var marker = event2circle.get(id);

     circle.interrupt();

      circle
      .transition()
        .ease('linear')
        .duration(500)
        .tween("radius", function(d){
            var rsvps = events_map.get(d.event_id).rsvp_yes;
            var i = d3.interpolateRound(radius(rsvps-1), radius(rsvps)+5);
            return function(t){
              marker.setRadius(i(t));
            };
        })
        .each('start', function(d){
          d3.select(this).on('mouseover', game);
          marker.setStyle({
            'color' : 'yellow',
            'fillColor' : 'yellow',
            'opacity': 1,
            'fillOpacity': 0.9
          });
        })
      .transition()
        .ease('linear')
        .duration(200)
        .tween("radius", function(d){
            var rsvps = events_map.get(d.event_id).rsvp_yes;
            var i = d3.interpolateRound(radius(rsvps)+5, radius(rsvps));
            return function(t){
              marker.setRadius(i(t));
            };
        })
        .each('end', function(d) {          
          d3.select(this).on('mouseover', null);
          timeTransition(d.event_id);
        });
        
  }

  function timeTransition(id){
     "use strict";
     var circle = d3.select("#id"+id);

     var marker = event2circle.get(id);

    var date = new Date();

    var colours = ["blue","red"];

    var heatmapColour = d3.scale.pow(0.3)
    .domain([0,1])
    .range(colours);

     circle
        .transition()
        .ease('linear')
        .duration(function(d) {
          return d.time-date.getTime();
        })
        .tween("color", function(d){
          var i = d3.interpolateRgb(heatmapColour(Math.exp((date.getTime()-d.time)/5e8)),"red");
          return function(t){
            marker.setStyle({
              'color' : i(t),
              'fillColor' : i(t)
            });                    
          };
        })        
        .each('start', function(){
          marker.setStyle({
            'opacity': 0.5,
            'fillOpacity': 0.2
          });
        });
  }

  function draw_edges(edges) {

    

   var colors = ["yellow", "black"];

    var edgeColorScale = d3.scale.linear()
    .domain([0,0.3])
    .range(colors);

    d3.select('svg')
    .selectAll('line')
    .data(edges, function(d){
      return d.id;
    })
    .enter()
    .append('g')
    .attr('class', 'edges')
    .append('line')
    .style('stroke', function(d){
      return edgeColorScale(d.weight*2);
    })
    .attr('x1', function(d){
      return map.latLngToLayerPoint(d.point1).x;
    })
    .attr('y1', function(d){
      return map.latLngToLayerPoint(d.point1).y;
    })
    .attr('x2', function(d){
      return map.latLngToLayerPoint(d.point2).x;
    })
    .attr('y2', function(d){
      return map.latLngToLayerPoint(d.point2).y;
    })
    .append('title')
    .text(function(d) {
        return "Weight: " + d.weight*100 + "%" +
               "\nCommon members n°: " + d.length;
      });
  }