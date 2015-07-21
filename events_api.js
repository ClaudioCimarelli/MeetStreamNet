function get_by_eventid(eventid,callback){ 
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	}
	else{
		key = '9796e202068fb23423157831262a';
		this.counter =0;
	}
    var id = eventid;
	$.ajax({
		'url': 'https://api.meetup.com/2/event/'+id,
		'data':{
			'key': key,
			'sign':true
		},
		'dataType': 'jsonp',
		'type': 'GET',		
		'success': function(data){
			callback(null,data);
		},
		'error': function(err){
			callback(err);
		}
	});
}
function get_events_by_loc(lat, lon, radius, callback){ 
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	}
	else{
		key = '9796e202068fb23423157831262a';
		this.counter =0;
	}
	$.ajax({
		'url': 'https://api.meetup.com/2/open_events/',
		'dataType': 'jsonp',
		'data':{
			'key': key,
			'sign':true,
			'lat': lat,
			'lon': lon,
			'radius': radius,
			'status': 'upcoming',
			'order': 'distance',
			'page': 20

		},
		'type': 'GET',
		'success': function(data){
			callback(null,data);
		},
		'error': function(err){
			callback(err);
		}
	});
}

function get_next(url, callback){
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	}
	else{
		key = '9796e202068fb23423157831262a';
		this.counter =0;
	}
	$.ajax({
		'url': url,
		'dataType': 'jsonp',
		'data':{
			'key': key,
			'sign':true
		},
		'type': 'GET',
		'success': function(data){
			callback(null,data);
		},
		'error': function(err){
			callback(err);
		}
	});
}

function get_events_meta(lat, lon, radius, callback){ 
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	}
	else{
		key = '9796e202068fb23423157831262a';
		this.counter =0;
	}
	$.ajax({
		'url': 'https://api.meetup.com/2/open_events/',
		'dataType': 'jsonp',
		'data':{
			'key': key,
			'sign':true,
			'lat': lat,
			'lon': lon,
			'radius': radius,
			'status': 'upcoming',
			'only': 'meta'

		},
		'type': 'GET',
		'success': function(data){
			callback(null,data);
		},
		'error': function(err){
			callback(err);
		}
	});
}