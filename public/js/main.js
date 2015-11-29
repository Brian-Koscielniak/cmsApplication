// Save content code
var contentSaveBtn = document.querySelector('#contentSaveBtn');
if(contentSaveBtn){contentSaveBtn.addEventListener("click", save_content)}
function update_content(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

	console.log(req.responseText);
	document.getElementById('content').innerHTML = req.responseText;
}
function save_content(){
	// update message box
	displaySavingMessage()	

	// This iframe holds the content
	var content_ifr = document.getElementById('content_ifr');

	// This code here makes the content inside the iframe accessable
	var content = content_ifr.contentDocument || content_ifr.contentWindow.document;
	
	// Get and encode the data for shipping to server
	var data = encodeURIComponent(content.getElementById('tinymce').innerHTML);
	
	// 
	page = document.getElementById("page_name").getAttribute('content');	
	Ajax.sendRequest(page, update_content, data);
}

var timeSaveBtn = document.querySelector('#timeSaveBtn');
var times = document.querySelectorAll("header input[type=text]")
if(timeSaveBtn){timeSaveBtn.addEventListener("click", save_times)}

function update_times(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

	timesBack = req.responseText.split("^^^")	
	times[0].value = timesBack[0];
	times[1].value = timesBack[1];
}
function save_times(){
	// update message box
	displaySavingMessage()	

	// Get and encode the data for shipping to server
	data = encodeURIComponent(times[0].value + "^^^" + times[1].value);

	// Send request
	Ajax.sendRequest("times", update_times, data);
}


// Sermon files upload code
var form = document.getElementById('uploadFile');
if(form){form.addEventListener('submit', save_file, false);};
var response = document.getElementById('response');

function save_file(e){
	// update message box
	displaySavingMessage()	

	e.preventDefault();
	var file = document.getElementById('file');
	var fileName = document.getElementById('fileName').value;
			
	// //check that file extention is .pdf
	// if (file.value.substr(-3)!=="pdf"){
	// 	alert('You can only upload pdf files');
	// 	e.preventDefault();
 //        //if nothing is done return to exit script
 //        return;
	// }
	
	var formData = new FormData();
	console.log(file.files[0]);	
	formData.append('file', file.files[0]);
	formData.append('data', fileName);
    
	//clear the values
	file.value = '';
	fileName.value = '';

	setTimeout(function(){Ajax.sendRequest('/sermons',update_table,formData,true)}, 2);
}

function update_table(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

	response.innerHTML = req.responseText;
	
	var fileData = JSON.parse(req.responseText)
	var tbody = document.querySelector("#sermonTable tbody");
	var tableContent = "";
	console.log(fileData[0])
	for(var i = fileData.length-1; i>=0; i--){
		console.log("loops");
		tableContent += "<tr>";
		tableContent += "<td><a href='" + fileData[i].path + "'/>" + fileData[i].name + "</td>";
		tableContent += "<td>" + fileData[i].date;
		tableContent += "<td>delete</td>";
		tableContent += "</tr>";
	}	
	tbody.innerHTML = tableContent;
}


// Display messages code
var messageBox = document.getElementById("messageBox");
function displaySavingMessage(){
	messageBox.innerHTML = "Saving Content..."
	messageBox.style.display = "block";	
}

function displaySuccessMessage(){
	messageBox.innerHTML = "Content has been successfully saved";	
	setTimeout(function(){messageBox.style.display = "none"}, 3000);
}
