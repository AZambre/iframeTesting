!function(){
	$("#getRequest").click(function(e) {
		$.ajax({
			type: "GET",
	        url: "/secure/data/getRequest",
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function(res) {
	        	console.log(res);
	        	$('.paragraph p').html(res.para);
	        }
	    });
	});
}();