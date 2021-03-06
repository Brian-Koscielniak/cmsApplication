// Save content code
var contentSaveBtn = document.querySelector('#contentSaveBtn');
if(contentSaveBtn){contentSaveBtn.addEventListener("click", save_content)}
function update_content(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

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
	
	// Because the express routes are common among pages, the page must be given so it properly update database
	page = document.getElementById("page_name").getAttribute('content');
	Ajax.sendRequest(page, update_content, data);
}

var timeSaveBtn = document.querySelector('#timeSaveBtn');
var times = document.querySelectorAll("header input[type=text]")
if(timeSaveBtn){timeSaveBtn.addEventListener("click", save_times)}

function update_times(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

	// Break apart the CSV 
	timesBack = req.responseText.split("^^^");

	// Update the UI display (even though data doesn't change)
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
