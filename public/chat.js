var messages = [];
var socket;

window.onunload = function(){
	socket.disconnect();
};

window.onload = function(){
	socket = io.connect('http://localhost:8080');
	
	var name = prompt('Представьтесь', 'Гость');
	if(name)
		socket.emit('hello', {name: name});
	
	var field = document.getElementById('field');
	var form = document.getElementById('form');
	var content = document.getElementById('content');
	
	form.onsubmit = function(){
		var text = field.value;
		socket.emit('send', {message: text});
		return false;
	};
	
	socket.on('message', function(data){
		if(!data.message){
			alert('Всё плохо');
		}else{
			messages.push(data.message);
			var html = '';
			for(var i=0; i<messages.length; i++)
				html += messages[i] + '<br>';
			content.innerHTML = html;
		}
	});
};
	