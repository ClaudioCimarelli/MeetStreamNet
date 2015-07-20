function eventid(error,eventid,userkey,handleData){ 
    if(error) {
    	console.err(error);
    	throw error;
    }
    var id = eventid;
    var key = userkey;
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