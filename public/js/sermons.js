(function(){
// Self calling function to populate the table
	// Don't bother with the table if there is nothing
	if(fileData){update_table()};
	if(fileData){assign_delete()};
}());

// Sermon files upload code
var form = document.getElementById('uploadFile');
var errorDisplay = document.getElementById('errorDisplay');
if(form){form.addEventListener('submit', save_file, false);};

function save_file(e){
	// We'd like the page not to reload. 
	e.preventDefault();

	// Get the inputs
	var file = document.getElementById('file');
	var fileName = document.getElementById('fileName').value;
	
	// invoke validate function, and if NOT validate break out effectively canceling save
	if(!validate(file, fileName)){return false};

	// update message box
	displaySavingMessage()	

	// Build the data to send to server
	var formData = new FormData();
	formData.append('file', file.files[0]);
	formData.append('data', fileName);

	//clear the values
	file.value = '';
	fileName.value = '';

	// Send the inputs
	Ajax.sendRequest('/sermons', update_table, formData, true);
}

function validate(file, fileName){
	// Clear out the error message
	errorDisplay.innerHTML = "";
	
	// Check to see	if there is more than empty or white space inside fileName
	if(!(/\S/.test(fileName))){
		// Update the error message
		errorDisplay.innerHTML = "A file name must be specified."	

		// if empty return false
		return false;
	}

	// Was a file given?...
	if(!file.files[0]){
		// Update the error message
		errorDisplay.innerHTML = "A file must be given."	

		// ...if not, break out
		return false;	
	}

	// Check if the type is pdf (only pdf format is allowed)
	if(file.files[0].type != "application/pdf"){
		// Update the error message
		errorDisplay.innerHTML = "File type must be .pdf format."	
	
		// if not pdf return false
		return false;
	}

	// If everything checks out then the inputs are valid, returns true
	return true;	
}

function delete_file(e){
	var data = encodeURIComponent(e.id);

	// Admin user must confirm the deletion. 'Cancel' will break out the function and not request deletion
	if(!confirm("Permanatly delete file?")){return false}

	// Now go and delete that file
	Ajax.sendRequest("/delete", update_table, data);
}

function assign_delete(){
// Gives the delete feature
	var delArr = document.querySelectorAll('.delete');
	for(i=0; i< delArr.length; i++){
		delArr[i].addEventListener('click', function(){delete_file(this)}, false);
	}
}

function update_table(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

	// fileData by defualt was sent on the GET request. On the POST request new data is sent and fileData is updated. 
	req ? fileData = JSON.parse(req.responseText) : fileData;

	// Built the table based on fileData
	var tbody = document.querySelector("#sermonTable tbody");
	var tableContent = "";

	// Server side file data is stored newest Last. To display newest First, we index backwards.
	for(var i = fileData.length-1; i>=0; i--){
		tableContent += "<tr>";
		tableContent += "<td><a class='fileLink' href='" + fileData[i].path + "'/>" + fileData[i].name + "</td>";
		tableContent += "<td>" + fileData[i].date;
		if(ADMIN){tableContent += "<td class='delete' id='" + fileData[i]._id + "'>delete</td>"};
		tableContent += "</tr>";
	}	

	tbody.innerHTML = tableContent;

	// Gives the delete feature 
	assign_delete();
}
