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
		'url': 'https://api.meetup.com/2/event/'+id+'?key='+key+'&sign=true',
		'dataType': 'jsonp',
		'type': 'GET',
		'success': callback
	});
}