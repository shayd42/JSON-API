
console.log("info sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function(){
  var req = {
    op: "info",                         // To request info, the op is 'info' and the subop is 'run'
    subop: "run",
    devices: true,                      // we want information about any nymi bands in the vicinity
    exchange: "exchange-" + Date.now()  // this is a unique value to match a response to a request
  };

  napiServer.send(JSON.stringify(req));
}

napiServer.onmessage = function(event){
  var msg = JSON.parse(event.data);    // when we get the response, parse it into a JS object
  console.log("message: ", msg);
}

