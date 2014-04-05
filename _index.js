var express = require('express');
var app = express();
var	io = require('socket.io').listen(app.listen(8080));
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res){
	res.render('page');
});

var users = {};
function getUsers(obj){
	var tmp = [];
	for(var i in obj)
		tmp.push(obj[i]);
	return tmp.join(', ');
}

io.sockets.on('connection', function(client){
	client.on('disconnect', function(){
		if(Object.keys(users).length > 1){
			client.get('nickname', function(err, name){
				client.broadcast.emit('message', {message: '--- '+name+' покинул чату!---'});
			});
		}
	delete users[client.id];
});
	client.on('send', function(data){
		client.get('nickname', function(err, name){
			io.sockets.emit('message', {message: name+': '+data.message});
		});
		//io.sockets.emit('message', {message: data.message});
	});
	client.on('hello', function(data){
		client.set('nickname', data.name);
		client.emit('message', {message: '---Добро пожаловать в чат '+data.name+ '!---'});
		client.broadcast.emit('message', {message: '--- '+data.name+' присоединился к чату!---'});
		//io.sockets.emit('message', {message: data.message});
		if(Object.keys(users).length > 0){
			var userList = getUsers(users);
			client.emit('message', {message: '--- Уже в чате:'+userList+' ---'});
		}else{
			client.emit('message', {message: '--- Кроме вас в чате никого нет :( ---'});
		}
		users[client.id] = data.name;
	});
});





