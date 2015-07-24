/* code for TopoJson */

  // var transform = d3.geo.transform({
  //         point: projectPoint
  //     });
  // var d3path = d3.geo.path().projection(transform);
  // function projectPoint(x, y) {
  //       var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  //             this.stream.point(point.x, point.y);
  //      };



 function addTo_eventsList(rsvp){

    if(rsvp.response !== 'yes' || 
      rsvp.venue === undefined ||
      (rsvp.venue.lat === 0 && rsvp.venue.lon ===0)) return; 

    var id = rsvp.event.event_id;
    var event = events_map.get(id);

    if(event === undefined){
      var callback = function(options){
          var draw = options.draw || true;
        /* callback to get the actual event object*/
          return function(err, doc){
              if(err) return console.log(err);
              if(!doc.id) return console.log(doc);
              if(!draw && events_map.has(doc.id)) return updateDrawRsvp(doc.id);
              create_event(doc);
              waiting_on_get.delete(doc.id);
          };
      };
      if(!waiting_on_get.has(id)){
          waiting_on_get.add(id);
          get_by_eventid({'id': id, 'fields': 'category' }, callback({'draw':true}));      
      }
      else  get_by_eventid({'id': id, 'fields': 'category' }, callback({'draw':false}));  
    }
    else {
      updateDrawRsvp(id);
    }
 }

 function updateDrawRsvp(id){
  var event = events_map.get(id);
  event.rsvp_yes++;
  draw_onRsvp(id);
 }

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
  .append("title")
  .style("opacity", ".5");

  map.on("viewreset", update);
}
/* update drawing on ZOOM event and new rsvp object in dataset */
 function update() {
  "use strict";
  /*update circles positions*/

  var g = svg.selectAll("g");
  
  var feature = g.selectAll("circle");

  feature
   .attr("cx", function(d){
      return map.latLngToLayerPoint(d.point).x;
      } )
    .attr("cy", function(d){
      return map.latLngToLayerPoint(d.point).y;
     } );
/* alternative way to traslate circle elements*/
 /*feature.attr("transform", 
   function(d) { 
     var y = d.coordinates[1];
     var x = d.coordinates[0];
     return "translate(" +
                     map.latLngToLayerPoint(new L.LatLng(x,y)).x + "," +
                     map.latLngToLayerPoint(new L.LatLng(x,y)).y + ")";
      });*/
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
      .transition()
      .ease('linear')
      .duration(200)
      .attr("r", function(d){
      var rsvps = events_map.get(d.id).rsvp_yes;
      return radius(rsvps);
      })
      .each('end', function(d) {
        timeTransition(d.id);
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

  var values = new Set();
  var idvalues = [0,1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,20,21,22];
  function arrayValue(d) {
    if (d.checked)
      values.add(d.value);
    else
      values.delete(d.value);
  }

  function filter_categories() {
     
     if(values.size===0) {
      idvalues.forEach(function(d) {
        var g = svg.select("#id"+d);
        g.style("opacity", null);
      });
      return;      
     }
     values.forEach(function(d) {
        var g = svg.select("#id"+d);
        g.style("opacity", null);
     });   

     idvalues.forEach(function(d) {
        if (!values.has(d+"")){
        var g = svg.select("#id"+d);
        g.style("opacity", 0);
        }
     });

  }