function update_content(req){
	console.log(req.responseText);
	document.getElementById('content').innerHTML = req.responseText;
}
function save_content(){
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
var saveBtn = document.querySelector('#contentSaveBtn');
if(saveBtn){saveBtn.addEventListener("click", save_content)}
