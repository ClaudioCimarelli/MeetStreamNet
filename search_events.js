function search_draw(lat, lon, radius){
	var callback = function(err, data){
		if(err) throw err;
		var results = data.results;
		results = results.filter(function(doc){
			return doc.venue !== undefined;
		});
		results.forEach(function(doc){
			var newEvent = {
			      'name' : doc.name,
			      'time': doc.time,
			      'url': doc.event_url,
			      'group_id' : doc.group.id,
			      'rsvp_yes': doc.yes_rsvp_count,
			      'lat': doc.venue.lat,
			      'lon': doc.venue.lon,
			      'counter':1
			  } ;
			  console.log(newEvent);

		})
		if(data.meta.next !== ""){
			get_next(data.meta.next, callback);
		}

	}
	get_events_by_loc(lat, lon, radius, callback)
}

var meta_information = function(err, data){
		if(err){
			return console.err(err);
		}
		var meta = data.meta;


	}
	//get_events_meta(lat, lon, radius, meta_information);