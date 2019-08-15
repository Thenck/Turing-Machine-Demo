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
	
	$(".run-btn").on("click",function(){
		if(lockStatus){
			
		}
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


// outputEnum
var outputEnum = {
    // 下一步
    next : 'next',
    // 上一步
    back : 'back',
    // 写
    write : 'write',
}

function turing(options){
	
	var programs = new Array();
	var allInputData = new Array();
	var allInputDataLength =  allInputData.length;
	var programsLength =  programs.length;
	
	var config,defaultOptions = {
		isNeedCheck:true,
		loopNum : 250
	}
	
	var stacks = new Array();
	
	var fetching = function (original, cover) {

        Object.keys(cover).forEach(function (key, i) {
            original.hasOwnProperty(key) ? original[key] = cover[key] : false;
        });

        return original;

    }; 
    config = options ? fetching(defaultOptions, options) : defaultOptions;
    
    var now = {
    	step:0,
    	index:0,
    	status:'',
    	inputData:'',
    }
    
    function init(){
    	this.allInputData = options.allInputData;
    	this.allInputDataLength = options.allInputData.length;
    	this.programs = options.programs;
    	this.programsLength = options.programsLength.length;
    	this.now = {
    		step:0,
    		index:0,
    		status:allInputData[0].status,
			inputData:allInputData[0].inputData,
    	}
//  	stacks.push(stack)
    }
    
    function nextStep(){
    	this.now = getNextData()
    	nextStepCallBack(this.now)
    }
    
    function backStep(){
    	this.now = getBackData()
		backStepCallBack(this.now);
    }
    
    function check(){
    	
    }
    
    function getNextData(){
    	var inputData = this.now.inputData;
    	var index = this.now.index;
    	var step = this.now.step;
    	var status = this.now.status;
    	if(this.stacks[step]!=null&&this.stacks[step]!=undefined){
    		return this.stacks[step];
    	}
    	var stack ={
    		inputData:inputData,
    		index:index,
    		step:step,
    		status:status
    	}
    	stacks.push(stack)
    	var output = getNextOutput(inputData,status);
    	if(output == null){
    		return {
    			"message":"Unable to find the corresponding program"
    		}
    	}
    	
    	if(output.output == outputEnum.next){
    		index = index + 1;
    		if(index>allInputDataLength){
    			index = 0;
    		}
    		inputData = allInputData[index%allInputDataLength];
    	}
    	if(output.output == outputEnum.back){
    		index = index - 1;
    		if(index < 0){
    			index = allInputDataLength;
    		}
    		inputData = allInputData[index];
    	}
    	if(output.output == outputEnum.write){
    		inputData = output.outputData;
    	}
    	step = step+1;
    	status = output.nextStatus;
    	
    	return {
    		inputData:inputData,
    		index:index,
    		step:step,
    		status:status
    	}
    	
    }
    
    function getBackData(){
    	var inputData = this.now.inputData;
    	var index = this.now.index;
    	var step = this.now.step;
    	var status = this.now.status;
		if(step <=0){
			return {
				message:'The first step cannot be back'
			}
		}
    	return this.stacks[stacks.length];
    	
    }
    
    function getNextOutput(inputData,status){
    	for(var index = 0;index <= this.programsLength.length;++index){
    		var program = this.programs[index];
    		if(inputData == porgram.inputData && status == porgram.status){
    			return {
    				output:output,
    				outputData:porgram.outputData,
    				nextStatus:porgram.nextStatus
    			}
    		}
    	}
    	return null;
    }
	
}


function programDirectives(inputData,status,outputData,nextStatus){
	return { 
	  inputData:inputData,
	  status:status,
	  outputData:outputData,
	  output:output,
	  nextStatus:nextStatus
	}
}
