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
		$(".program-table").find("input").attr("readonly","readonly");
		$(".program-table").find("select").attr("disabled","disabled");
		$(this).hide();
		$(".unlock-program").show();
		lockStatus = true;
	})
	
	$(".unlock-program").on("click",function(){
		$(".program-table").find("input").attr("readonly",false);
		$(".program-table").find("select").attr("disabled",false);
		$(this).hide();
		$(".lock-program").show();
		lockStatus = false;
	})
})
