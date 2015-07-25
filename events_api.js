function get_by_eventid(params,callback){
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
		//console.log('claudio');
	} else if(this.counter === 1){
		key = '493366a27c7b402c257c1a2e18237e';
		this.counter++;
		//console.log('john');
		} else {
			key = '9796e202068fb23423157831262a';
			this.counter =0;
			//console.log('edo');
		  }
	$.ajax({
		'url': 'https://api.meetup.com/2/event/'+params.id,
		'data':{
			'key': key,
			'sign':true,
			'fields': params.fields || ""
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

function get_events_by_loc(params, callback){ 
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	} else if(this.counter === 1){
		key = '493366a27c7b402c257c1a2e18237e';
		this.counter++;
		} else {
			key = '9796e202068fb23423157831262a';
			this.counter =0;
		  }
	$.ajax({
		'url': 'https://api.meetup.com/2/open_events/',
		'dataType': 'jsonp',
		'data':{
			'key': key,
			'sign':true,
			'lat': params.lat,
			'lon': params.lon,
			'radius': params.radius || 100,
			'status': params.status || 'upcoming',
			'order': params.order|| 'distance',
			'page': params.page || 50,
			'offset': params.offset || 0,
			'fields': params.fields || ""
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


function get_event_attendance(params, callback){ 
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	} else if(this.counter === 1){
		key = '493366a27c7b402c257c1a2e18237e';
		this.counter++;
		} else {
			key = '9796e202068fb23423157831262a';
			this.counter =0;
		  }
	$.ajax({
		'url': '/'+params.urlname+'/events/'+params.event_id+'/attendance',
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

function get_members(params,callback){ 
	var key;
	if(this.counter === undefined){
	this.counter=0;}
	if(this.counter === 0){
		key = '52f2a7670c33a1e4634122a4e9';
		this.counter++;
	} else if(this.counter === 1){
		key = '493366a27c7b402c257c1a2e18237e';
		this.counter++;
		} else {
			key = '9796e202068fb23423157831262a';
			this.counter =0;
		  }
	$.ajax({
		'url': 'https://api.meetup.com/2/members/',
		'data':{
			'key': key,
			'sign':true,
			'group_id': params.group_id,
			'page': params.page || 100000,
			'only': "id"
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