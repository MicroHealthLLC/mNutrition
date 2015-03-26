function sendReq(url,clback){
	$("#busy-holder").show()
	var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=?';
	$.getJSON(yql, clback).fail(function(){
		console.log('failed')
	});
}

function search(){
	var keyword = $("#search-text").val();
	keyword=keyword.replace(/ /g,"+");
	//http://auto.fatsecret.com/?m=1&l=1&query=ba
	var url = "http://www.nutritioncompare.ianmburns.com/api/food?search="+keyword;
	sendReq(url,callback)
}

function getFoodDetails(id){
	var url = "http://www.nutritioncompare.ianmburns.com/api/food/"+id;
	sendReq(url,showDetails)	
}

var servings = "";
var description=name=type=url=fId='';	
function showDetails(response){
	$("#busy-holder").hide();
	var results = response['query']['results'];
	if(results!=null){
		var resObj = results['json'];
		servings = resObj['servings']['serving']
		if(resObj['food_description']!=null){
			description=resObj['food_description']
		}
		fId = resObj['food_id']
		if(resObj['food_name']!=null){
			name=resObj['food_name']
		}
		if(resObj['food_type']!=null){
			type=resObj['food_type']
		}
		if(resObj['food_url']!=null){
			url=resObj['food_url'];
		}
		var resStr='';

/*		resStr+="<b>Description:</b>  "+description+"<br/><br/>";
		resStr+="<b>Id:</b>  "+fId+"<br/><br/>";
		resStr+="<b>Type:</b>  "+type+"<br/><br/>";
		resStr+="<b>Url:</b>  "+url+"<br/><br/>";
		resStr+="<b>Name:</b>  "+name+"<br/><br/>";*/
		$("#food-name").html(name).attr({'href':url,"target":"_blank"});		
		var optStr=''
		if(servings instanceof Array){
			for(var i=0;i<servings.length;i++){
				optStr+="<option value='"+i+"'>"+servings[i]['serving_description']+"</option>";
			}
			$("#details").html(detailStr(0))
		}else{
			optStr+="<option value='obj'>"+servings['serving_description']+"</option>";
			$("#details").html(detailStr('obj'))
		}
		$("#ser-size").html(optStr);
		$("#results").show();
	}
}

function detailStr(index){
	if(index!='obj'){
		index = parseInt(index);	
		var obj = servings[index];
	}else{
		var obj = servings;
	}
	var retStr = '';
	
	for(var j in obj){
		if(j!='serving_id' && j!='serving_url'){
			var dispName = j;
			if(j=='serving_description'){
				dispName = "Serving";
			}
			if(j=='measurement_description'){
				dispName = "Measurement";
			}
			if(j=='metric_serving_amount'){
				dispName = "Metric Serving size";
			}
			if(j=='metric_serving_unit'){
				dispName = "unit of measure";
			}
			if(j=='number_of_units'){
				dispName = "number of units";
			}
			if(j=='measurement_description'){
				dispName = "Measurement";
			}
			/*if(j=='saturated_fat'){
				dispName = "saturated fat";
			}
			if(j=='polyunsaturated_fat'){
				dispName = "polyunsaturated fat";
			}
			if(j=='monounsaturated_fat'){
				dispName = "monounsaturated fat";
			}
			if(j=='trans_fat'){
				dispName = "trans fat";
			}
			if(j=='vitamin_a'){
				dispName = "vitamin a";
			}
			if(j=='vitamin_c'){
				dispName = "vitamin c";
			}*/
			dispName = dispName.replace(/\_/, ' ')
			retStr+="<p><b style='text-transform:capitalize;'>"+dispName+": </b><a style='float:right'>"+obj[j]+"</a></p>";
		}
	}
	return retStr;
}

function callback(res){
	$("#busy-holder").hide()
	var results = res['query']['results']	
	if(results!=null){
		var resArray = results['json']['json'];
		var len = resArray.length;
		var resStr = '<ul class="search-popup">';
		for(var i=0;i<len;i++){
			resStr+='<li data-id="'+resArray[i]['food_id']+'">'+resArray[i]['food_name']+"</li>"
		}
		resStr+="</ul>"
		if(!$("#search-popup").length){
			$('body').append('<div id="search-popup" style="position:absolute"></div>');
			$("#search-popup").css({"width":$(".testBody").width(),"max-height":"100px","overflow-y":"auto","cursor":"pointer"});
			$("#search-popup").css({"left":$("#search-text").offset().left,"top":$("#search-text").offset().top+$(".testBody").height()+3,"background":"white"})
			//$('body').height($('body').height()+100)
			$("#search-popup").html(resStr);
		}else{
			$("#search-popup").html(resStr).show();
		}
	}
	$("#search-popup").on("click","li",function(e){
		getFoodDetails($(this).attr('data-id'));
	})
	//$("#results").show().find(".ellipse").hide();
	$("#search-text").focus();

}

$( document ).ready(function() {
	$("#find").on("click",function(){
		search();
	});

	$("#search-text").on("keyup",function(e){
		var keycode = e.keyCode;
		if(keycode==13 /*|| $(this).val().length>2*/)
			search();
	}).on("click",function(e){
		e.stopPropagation();
	})

	$("#ser-size").on('change',function(){
		$("#details").html(detailStr($(this).val()))
	})

}).click(function(){
	$("#search-popup").hide();
});