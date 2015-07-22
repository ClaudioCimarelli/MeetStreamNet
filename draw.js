/* code for TopoJson */

  // var transform = d3.geo.transform({
  //         point: projectPoint
  //     });
  // var d3path = d3.geo.path().projection(transform);
  // function projectPoint(x, y) {
  //       var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  //             this.stream.point(point.x, point.y);
  //      };


/* CORE STREAMING part, 
    recall must client to get streamed data of rsvp objects */

 must.Rsvps(function(rsvp) {
  addTo_eventsList(rsvp);
 });

/* initialize data structures to store events for D3 data nodes*/
 var events_id_list = [];
 var events_list = new Map();
 var waiting_on_get = new Set();

 function addTo_eventsList(rsvp){

  if(rsvp.response !== 'yes' || 
    rsvp.venue === undefined ||
    (rsvp.venue.lat === 0 && rsvp.venue.lon ===0)) return; 

  var id = rsvp.event.event_id;
  var event = events_list.get(id);

  if(event === undefined){
       
    /* callback to get the actual event object*/
  var callback = function(err, doc){
    if(err) return console.log(err);

    //console.log(doc);

    var newEvent = {
      'event_id': doc.id,
      'name' : doc.name,
      'time': doc.time,
      'url': doc.event_url,
      'group_id' : doc.group.id,
      'rsvp_yes': doc.yes_rsvp_count,
      'lat': doc.venue.lat,
      'lon': doc.venue.lon,
      'counter':1
    }

    if(doc.duration)
      newEvent.duration = doc.duration;
    else
      newEvent.duration = 10800000;

    /*push the new discovered event into the map*/
      events_list.set(doc.id, newEvent);
      draw_onRsvp(doc.id);
      waiting_on_get.delete(doc.id);
  }

  if(!waiting_on_get.has(id)){
      waiting_on_get.add(id);
      var point = new L.LatLng(rsvp.venue.lat, rsvp.venue.lon);
      events_id_list.push({
        'id': id,
        'point': point,
        'time': rsvp.event.time
      });
      draw_enter(events_id_list);
    }
    get_by_eventid(id, callback);   

  }
  else {
    event.counter++;
    event.rsvp_yes++;
    draw_onRsvp(id);
  }
 }

/* function to set up  the drawing of NEW elements ENTERING the dataset */
var radius = d3.scale.sqrt()
    .domain([0, 700])
    .range([1, 15]);

function draw_enter(collection){
  "use strict"; 

   var feature =
    g.selectAll("circle")
    .data(collection,function(d){
      return d.id;
    });
   var enterCircles = feature.enter();
/* append svg circle element and text tip */
   enterCircles
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
    //.style("fill", "teal");

   map.on("viewreset", update);

/* update drawing on ZOOM event and new rsvp object in dataset */
   function update() {
    "use strict";
    /*update circles positions*/
    g
    .style("opacity", 0);

    feature
    .each(function(){
      d3.select(this)
      .attr("cx", function(d){
      return map.latLngToLayerPoint(d.point).x;
    } )
    .attr("cy", function(d){
      return map.latLngToLayerPoint(d.point).y;
    } );
    });

    g
    .style("opacity", null);
    

      //* alternative way to traslate circle elements*/
       /*feature.attr("transform", 
         function(d) { 
           var y = d.coordinates[1];
           var x = d.coordinates[0];
           return "translate(" +
                           map.latLngToLayerPoint(new L.LatLng(x,y)).x + "," +
                           map.latLngToLayerPoint(new L.LatLng(x,y)).y + ")";
            });*/
   }  
}

/*update radius and tip on rsvp received */

function draw_onRsvp(id){
  "use strict";   

    var circle = g.select("#id"+id);
/*UPDATE TIP*/
    circle.select("title")
      .text(function(d) {
        var event = events_list.get(d.id);
        var date = new Date();
        return event.name
            + "\nRSVPs Number : " + event.rsvp_yes
            + "\nStart date : " + strftime('%F %R\n', new Date(d.time))
            + "\nColor : blue-->proposed || red-->upcoming";
      });

    blink_transition(id); //start transition on rsvp
}
/* blink events that received an RSVP */
  function blink_transition(id){
    "use strict";
     var circle = g.select("#id"+id);

     circle.interrupt();

      circle
      .style("opacity", .9)
      .style("fill", "yellow")
      .transition()
      .ease('linear')
      .duration(500)
      .attr("r", function(d){
      var rsvps = events_list.get(d.id).rsvp_yes;
      return radius(rsvps)+5;
      })
      .transition()
      .ease('linear')
      .duration(200)
      .attr("r", function(d){
      var rsvps = events_list.get(d.id).rsvp_yes;
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

     var circle = g.select("#id"+id);
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