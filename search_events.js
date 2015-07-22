function search_draw(options){
	var lat = options.lat || 41.8858;
	var lon = options.lon || 12.4822;
	var radius = options.radius || 100;
	var limit = options.limit || 1000;
	var callback = function(err, data){
		if(err) throw err;
		if(!data) return;
		var results = data.results;
		results = results.filter(function(doc){
			return doc.venue !== undefined;
		});
		limit -= results.length;
		results.forEach(function(doc){
			var newEvent = {
				'event_id': doc.id,
			    'name' : doc.name,
			    'time': doc.time,
			    'url': doc.event_url,
			    'rsvp_yes': doc.yes_rsvp_count,
			    'lat': doc.venue.lat,
			    'lon': doc.venue.lon,
			    'counter':1
			  } ;

			if(doc.duration)
			  	newEvent.duration = doc.duration;
			else 
				newEvent.duration = 10800000;
			
			 draw_event(newEvent);
		})
		if(data.meta.next !== "" && limit>0){
			get_next(data.meta.next, callback);
		}

	}
	if(limit>0)
	get_events_by_loc(lat, lon, radius, callback);
}

function draw_event(event){
	if(events_list.has(event.event_id)) return;
	var point = new L.LatLng(event.lat, event.lon);
      events_id_list.push({
        'id': event.event_id,
        'point': point,
        'time': event.time
      });
      events_list.set(event.event_id, event);
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