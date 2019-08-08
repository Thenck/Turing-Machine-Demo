//program is lock
var lockStatus = false;
$(function(){
	//ouput
	$(document).on("change",".output" ,function () {
	    var value = $(this).find("option:selected").attr("value");
	    if(value=="write"){
	        $(this).parent().find(".output-write").show()
	    }else{
	    	$(this).parent().find(".output-write").val('');
	  	    $(this).parent().find(".output-write").hide()
	    }
	})
	
	$(document).on("click",".delete-btn" ,function () {
		if(!lockStatus){
			$(this).parents("tr").remove();
		}
	})
	
	$(".add-program").on("click",function(){
		if(!lockStatus){
			var html = $("#program-contentTpl").html();
			$(".program-table").find("tbody").append(html);
		}
	})


	$(".add-init-item").on("click",function(){
		if(!lockStatus){
			var html = $("#init-input-contentTpl").html();
			$(".init-input-table").find("tbody").append(html);
		}
	})

	$(".lock-program").on("click",function(){
		if(lockCheck()){
			$(".program-table").find("input").attr("readonly","readonly");
			$(".program-table").find("select").attr("disabled","disabled");
			$(".init-input-table").find("input").attr("readonly","readonly");
			$(".init-input-table").find("select").attr("disabled","disabled");
			$(this).hide();
			$(".unlock-program").show();
			lockStatus = true;
		}
	})
	
	$(".unlock-program").on("click",function(){
		$(".program-table").find("input").attr("readonly",false);
		$(".program-table").find("select").attr("disabled",false);
		$(".init-input-table").find("input").attr("readonly",false);
		$(".init-input-table").find("select").attr("disabled",false);
		$(this).hide();
		$(".lock-program").show();
		lockStatus = false;
	})
})


function lockCheck(){
	var result = true;
	
	if(!checkProgramDirectives()){
		result = false;
	}
	if(!checkInitInput()){
		result = false;
	}
	return result;
}

function checkProgramDirectives(){
	var result =true;
	$(".program-table").find("tbody").find("input").each(function(){
		if(!isNotNull($(this).val())){
			
			if($(this).hasClass("output-write")&&$(this).css("display")=="none"){
				result =true;
				$(this).removeClass("error");
			}else{
				result =false;
				$(this).addClass("error");
			}
			
			
		}else{
			$(this).removeClass("error");
		}
	})
	
	$(".program-table").find("tbody").find("select").each(function(){
		if(!isNotNull($(this).val())){
			result =false;
			$(this).addClass("error");
		}else{
			$(this).removeClass("error");
		}
	})
	return result;
}

function checkInitInput(){
	var result =true;
	$(".init-input-table").find("tbody").find("input").each(function(){
		if(!isNotNull($(this).val())){
			result =false;
			$(this).addClass("error");
		}else{
			$(this).removeClass("error");
		}
	})
	$(".init-input-table").find("tbody").find("select").each(function(){
		if(!isNotNull($(this).val())){
			result =false;
			$(this).addClass("error");
		}else{
			$(this).removeClass("error");
		}
	})
	return result;
}

function isNotNull(value){
	if(typeof(value)=="undefined"|| value==undefined||value == "" ){
		return false;
	}
	return true;
}


function turing(options){
	

	
}

function programDirectives(input,status,output,nextStatus){
	return 
	{input:input,
	status:status,
	output:output,
	nextStatus:nextStatus}
}
