import socketio from 'socket.io-client';

const socket = socketio('http://localhost:3333', {
    autoConnect:false,
});

function flowStarted(startFunction){
    socket.on("flowStarted", startFunction);
}

function flowFinished(endFunction){
    socket.on("flowFinished", endFunction);
}

function connect(){
    socket.connect();
}

function disconnect(){
    if(socket.connected){
        socket.disconnect();
    }
}

export {
    connect,
    disconnect,
    flowStarted,
    flowFinished
}