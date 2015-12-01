(function(){
	assign_delete();
	if(fileData){update_table()};
}());

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

	var formData = new FormData();
	formData.append('file', file.files[0]);
	formData.append('data', fileName);

	//clear the values
	file.value = '';
	fileName.value = '';

	//
	Ajax.sendRequest('/sermons', update_table, formData, true);
}

function delete_file(e){
	var data = encodeURIComponent(e.id);
	
	Ajax.sendRequest("/delete", update_table, data);
}

function assign_delete(){
	var delArr = document.querySelectorAll('.delete');
	for(i=0; i< delArr.length; i++){
		delArr[i].addEventListener('click', function(){delete_file(this)}, false);
	}
}


function update_table(req){
	// update message box. I've added a timeout to the function call, just so that the first message can be seen if Ajax happens too quickly.
	setTimeout(function(){displaySuccessMessage()}, 100)

	req ? fileData = JSON.parse(req.responseText) : fileData;

	var tbody = document.querySelector("#sermonTable tbody");
	var tableContent = "";
	for(var i = fileData.length-1; i>=0; i--){
		tableContent += "<tr>";
		tableContent += "<td><a href='" + fileData[i].path + "'/>" + fileData[i].name + "</td>";
		tableContent += "<td>" + fileData[i].date;
		if(ADMIN){tableContent += "<td class='delete' id='" + fileData[i]._id + "'>delete</td>"};
		tableContent += "</tr>";
	}	
	tbody.innerHTML = tableContent;
	assign_delete();
}
