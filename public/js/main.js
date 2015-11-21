function testFunc(req){
	console.log(req.responseText);
	document.getElementById('content').innerHTML = req.responseText;
}
function testAjax(){
	// This iframe holds the content
	var content_ifr = document.getElementById('content_ifr');

	// This code here makes the content inside the iframe accessable
	var content = content_ifr.contentDocument || content_ifr.contentWindow.document;
	
	// Get and encode the data for shipping to server
	var data = encodeURIComponent(content.getElementById('tinymce').innerHTML);
	
	// TODO: this will only work on home page.. 
	Ajax.sendRequest('/home', testFunc, data);
}
var saveBtn = document.querySelector('#contentSaveBtn');
saveBtn.addEventListener("click", testAjax);
