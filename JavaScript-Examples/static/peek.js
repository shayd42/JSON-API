
console.log("peek sample");

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
  var devices = JSON.parse(event.data).info.devices; // extract the devices from the response
  var n = devices.length;
  if(0 == n){
    console.log("no nymi bands were found");
  }
  else{
    // collect all the authenticated nymi bands
    var authenticated = []
    for (var i = 0; i < n; i++) {
      if(devices[i].provisioned && ("authenticated" == devices[i].state.found)){
        authenticated.push(devices[i].id);
      }
    }

    var m = authenticated.length;
    if(0 == m){
      console.log("no authenticated nymi bands were found");
    }
    console.log("authenticated nymi bands: ", m, authenticated);
  }
}

