import socketio from 'socket.io-client';

const socket = socketio('http://localhost:3333', {
    autoConnect:false,
});

function connect(){
    socket.connect();
    resetSocketListeners();
}

function disconnect(){
    if(socket.connected){
        socket.disconnect();
    }
}

function setBeforeRunningFlowStarted(startFunction){
    socket.beforeFlowStarted = startFunction;
}
function setBeforeRunningFlowFinished(endFunction){
    socket.beforeFlowFinished = endFunction;
}
function sendMessage(messageName, callback){
    const receivedFunction = callback;
    callback = (...rest) => {
        let before;
        switch (messageName) {
            case "flowStarted":
                before = socket.beforeFlowStarted;
                break;
            case "flowFinished":
                before = socket.beforeFlowFinished;
                break;
            default:
                before = undefined;
                break;
        }

        if (before) before(...rest);
        receivedFunction(...rest);
    }
    
 
    socket.on(messageName, callback);
}


function resetSocketListeners(){
    
    var _onevent = socket.onevent;

    socket.onevent = function (packet) { //Override incoming
        //var args = packet.data || [];
        //console.log(args);
        //console.log(socket);
        //console.log('***', 'onevent', packet);
        const length = socket._callbacks[`$${packet.data[0]}`].length;
        socket._callbacks[`$${packet.data[0]}`] = [socket._callbacks[`$${packet.data[0]}`][length-1]];
        _onevent.call(socket, packet);
    };
}


function teste(){
    socket.on("teste", () => {alert("1")})
    socket.on("teste", () => {alert("2")})
    socket.on("teste", () => {alert("3")})
}

export {
    connect,
    disconnect,
    setBeforeRunningFlowStarted,
    setBeforeRunningFlowFinished,
    sendMessage,
    teste
}