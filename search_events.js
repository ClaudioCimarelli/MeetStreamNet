function manage_newRsvp(rsvp){

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
              if(doc.problem) return console.log(doc);
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


function search_draw(options,callback){
	var params = {
		'lat' : options.lat || 41.8858,
		'lon' : options.lon || 12.4822,
		'radius' : options.radius || 100,
		'page': options.page || 50,
		'offset': options.offset || 0,
		'fields': options.fields || "category"
	}
	var limit = options.limit || 100;

	if(limit< params.page) params.page = limit;

	var counter = limit/params.page; 

	function get_results(err, data){
		if(err) throw err;
		if(data.problem) return console.log(data);
		var results = data.results;
		if(!results) return console.log(data);
		results = results.filter(function(doc){
			return doc.venue !== undefined &&
					(doc.venue.lat !== 0 && doc.venue.lon !==0);
		});
		limit -= results.length;
		results.forEach(function(doc){			
			 create_event(doc);
		});
		params.offset++;
		if(callback){
			callback(null, results);
		}
		if(data.meta.next !== "" && limit>0 && params.offset<counter){			
			get_events_by_loc(params, get_results);
		}		
	}
	get_events_by_loc(params, get_results);	
}

function view_relations(d) {
	var myevent = events_map.get(d.id);
	var options = {
	'lat' : d.point.lat,
	'lon' : d.point.lng,
	'limit': 50
    }
    search_draw(options, callback);  

    function callback(err, eventsList){
		if(err) throw err;
		get_members({
			"group_id": myevent.group_id
		}, pre_intersect);

		function pre_intersect(err, data) {
			if(err) throw err;
			var myevent_members = data.results;
			myevent_members = myevent_members.map(function(mem){
				return mem.id;
			});
			eventsList.forEach(function(event){
				get_members({
				"group_id": event.group.id
				}, intersect);

				function intersect(err,data) {
					if(err) throw err;
					var event_members = data.results;
					event_members = event_members.map(function(mem){
						return mem.id;
					});
					var intersection = $.arrayIntersect(myevent_members, event_members);
					console.log(intersection);
					if(intersection.length>0)
						draw_edge(myevent.event_id, event.id, intersection.length);
				}
			});	
	    }
	}
}

$.arrayIntersect = function(a, b){
	return $.grep(a, function(i){
    	return $.inArray(i, b) > -1;
	});
};

function create_event(doc){
	if(events_map.has(doc.id)) return;
	var deafaultCategory = {
	      'id': 0,
	      'name' : "Uncategorized",
	      'shortname': "Uncategorized"
	  }
	var point = new L.LatLng(doc.venue.lat, doc.venue.lon);
	var newEvent = {
		'event_id': doc.id,
		'name' : doc.name,
		'time': doc.time,
		'url': doc.event_url,
		'rsvp_yes': doc.yes_rsvp_count,
		'point' : point,
		'category': doc.group.category || deafaultCategory,
		'group_urlname' : doc.group.urlname,
		'group_id' : doc.group.id,
		'counter':1
	};
	/* set duration of event */
	if(doc.duration)
		newEvent.duration = doc.duration;
	else
		newEvent.duration = 10800000;

	/*index category -> list event */
	var category = newEvent.category;
	var category_list = category_map.get(category.id);
	if(!category_list){
		category_list = [];
		category_map.set(category.id, category_list);
	}
	category_list.push({
	  'id': doc.id,
	  'point': point,
	  'time': newEvent.time
	});
	/*base index event_ID -> event */
	events_map.set(doc.id, newEvent); 
	draw_enter(category.id);
	draw_onRsvp(doc.id);
}


var gamecount = 0;
  function game(d){
    gamecount++;
    d3.select(this)
    .on('mouseover', null);
    console.log(gamecount);
  }