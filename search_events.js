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
			 create_event(doc);
		});
		params.offset++;
		if(data.meta.next !== "" && limit>0 && params.offset<counter){			
			get_events_by_loc(params, callback);
			//get_next(data.meta.next, callback);
		}

	}
		get_events_by_loc(params, callback);
}

function create_event(doc){
	if(events_map.has(doc.id)) return;
	var deafaultCategory = {
	      'id': 0,
	      'name' : "uncategorized",
	      'shortname': "uncategorized"
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
	  'id': id,
	  'point': point,
	  'time': newEvent.time
	});
	/*base index event_ID -> event */
	events_map.set(doc.id, newEvent); 
	draw_enter(category.id);
	draw_onRsvp(doc.id);
}
