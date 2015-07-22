function search_draw(options){
	var params = {
		'lat' : options.lat || 41.8858,
		'lon' : options.lon || 12.4822,
		'radius' : options.radius || 100,
		'page': options.page || 20,
		'offset': options.offset || 0,
		'fields': options.fields || "category"
	}
	var limit = options.limit || 100;

	if(limit< params.page) params.page = limit;

	var counter = limit/params.page; 

	var callback = function(err, data){
		if(err) throw err;
		if(!data) return;
		var results = data.results;
		if(!results) return;
		results = results.filter(function(doc){
			return doc.venue !== undefined;
		});
		limit -= results.length;
		results.forEach(function(doc){
			
			var deafaultCategory = {
				'id': 0,
				'name' : "uncategorized",
				'shortname': "uncategorized"
			}
			var newEvent = {
				'event_id': doc.id,
			    'name' : doc.name,
			    'time': doc.time,
			    'url': doc.event_url,
			    'rsvp_yes': doc.yes_rsvp_count,
			    'lat': doc.venue.lat,
			    'lon': doc.venue.lon,
			    'category': doc.group.category || deafaultCategory,
			    'counter':1
			  } ;

			if(doc.duration)
			  	newEvent.duration = doc.duration;
			else 
				newEvent.duration = 10800000;
			
			 draw_event(newEvent);
		})
		params.offset++;
		if(data.meta.next !== "" && limit>0 && params.offset<counter){			
			get_events_by_loc(params, callback);
			//get_next(data.meta.next, callback);
		}

	}
		get_events_by_loc(params, callback);
}

function draw_event(event){
	if(events_map.has(event.event_id)) return;
	var point = new L.LatLng(event.lat, event.lon);
      events_id_list.push({
        'id': event.event_id,
        'point': point,
        'time': event.time
      });
      /*set index for category */
      var category = event.category;
      var category_list = category_map.get(category.id);
      if(!category_list){
	      category_list = [];
	      category_map.set(category.id, category_list);
	  }	  
      category_list.push(event);
      
      events_map.set(event.event_id, event);
      draw_enter(events_id_list);
      draw_onRsvp(event.event_id);
}

var meta_information = function(err, data){
		if(err){
			return console.err(err);
		}
		var meta = data.meta;


	}
	//get_events_meta(lat, lon, radius, meta_information);