function get_by_eventid(eventid,handleData,userkey){ 
    var id = eventid;
    var key = userkey || '52f2a7670c33a1e4634122a4e9';
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