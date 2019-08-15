//program is lock
var lockStatus = false;
var turingMachine = null;
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
			$(".initStatus").attr("readonly","readonly");
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
		$(".initStatus").attr("readonly",false);
		$(this).hide();
		$(".lock-program").show();
		lockStatus = false;
	})
	
	$(".run-btn").on("click",function(){
		if(lockStatus){
			var programs = getPrograms();
			var allInputData = getAllInputData();
			turingMachine = turing({
				allInputData:allInputData,
				programs:programs,
				nextStepCallBack:function(){
					
				},
				backStepCallBack:function(){
					
				},
				domInit:buildTapeDom,
				initStatus:$(".initStatus").val()
			})
			turingMachine.init();
		}
	})
})

function buildTapeDom(loopNum,allInputData){
	for(var index = 1;index<=loopNum;++index){
		for(var i in allInputData){
			$(".tape").find("tr").append(getTapeItem(i,allInputData[i]));
		}
	}
}

function getTapeItem(index,inputData){
	var html = '<td index="@index">@inputData</td>'
	html = html.replace("@inputData",inputData)
	html = html.replace("@index",index)
	return html;
}

function getPrograms(){
	var programs = new Array();
	$(".program-table").find(".program-item").each(function(){
		var inputData = $(this).find(".input").val();
		var status = $(this).find(".status").val();
		var output = $(this).find(".output").val();
		var nextStatus = $(this).find(".nextStatus").val();
		var outputData = $(this).find(".output-write").val();
		var program =  { 
			  inputData:inputData,
			  status:status,
			  outputData:outputData,
			  output:output,
			  nextStatus:nextStatus
		}
		programs.push(program);
	})
	return programs;
}

function getAllInputData(){
	var allInputData = new Array();
	$(".init-input-table").find("tbody").find(".input-item").each(function(){
		var index = $(this).find(".index").val();
		var inputData = $(this).find(".input").val();
		allInputData.push(inputData);
	})
	return allInputData;
}

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
	if(!isNotNull($(".initStatus").val())){
		result =false;
		$(".initStatus").addClass("error");
	}else{
		$(".initStatus").removeClass("error");
	}
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
		allInputData:new Array(),
		programs:new Array(),
		isNeedCheck:true,
		loopNum : 250,
		initStatus:'',
		domInit:function(){
			
		},
		nextStepCallBack:function(){
			
		},
		backStepCallBack:function(){
			
		}
		
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
    	allInputData = config.allInputData;
    	allInputDataLength = config.allInputData.length;
    	programs = config.programs;
    	programsLength = config.programs.length;
    	now = {
    		step:0,
    		index:0,
    		status:	config.initStatus,
			inputData:allInputData[0],
    	}
    	config.domInit(config.loopNum,allInputData)
//  	stacks.push(stack)
    }
    
    function nextStep(){
    	now = getNextData()
    	config.nextStepCallBack(this.now)
    }
    
    function backStep(){
    	now = getBackData()
		config.backStepCallBack(this.now);
    }
    
    function check(){
    	
    }
    
    function getNextData(){
    	var inputData = now.inputData;
    	var index = now.index;
    	var step = now.step;
    	var status = now.status;
    	if(stacks[step]!=null&&stacks[step]!=undefined){
    		return stacks[step];
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
    	var inputData = now.inputData;
    	var index = now.index;
    	var step = now.step;
    	var status = now.status;
		if(step <=0){
			return {
				message:'The first step cannot be back'
			}
		}
    	return stacks[stacks.length];
    	
    }
    
    function getNextOutput(inputData,status){
    	for(var index = 0;index <= programsLength;++index){
    		var program = programs[index];
    		if(inputData == program.inputData && status == program.status){
    			return {
    				output:program.output,
    				outputData:program.outputData,
    				nextStatus:program.nextStatus
    			}
    		}
    	}
    	return null;
    }
	
	return {
		nextStep:nextStep,
		backStep:backStep,
		init:init
	}
}

