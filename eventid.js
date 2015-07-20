function eventid(error,eventid,handleData,userkey){ 
    if(error) {
    	console.err(error);
    	throw error;
    }
    var id = eventid;
    var key = userkey || '9796e202068fb23423157831262a';
	$.ajax({
		url: 'https://api.meetup.com/2/event/'+id+'?key='+key+'&sign=true',
		dataType: 'JSONP',
		jsonpCallback: 'callback',
		type: 'GET',
		success: function (data) {
			handleData(data);
		    //alert(JSON.stringify(data));
		    // console.log(data);
		}
	});
}