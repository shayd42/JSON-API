/*
Copyright 2016 Nymi Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function () {
  var req = {
    op: "info",                         // To request info, the op is 'info' and the subop is 'get'
    subop: "get",
    exchange: "exchange-" + Date.now()  // this is a unique value to match a response to a request
  };

  napiServer.send(JSON.stringify(req));
}

napiServer.onmessage = function (event) {
  var resp = JSON.parse(event.data)
  if("info" == resp.op){
    var authenticated = resp.provisionsPresent;
    if(authenticated === undefined){
      var txt = document.createTextNode("there are " + resp.nymiband.length + " Nymi Bands in the area, none of them are provisioned");
      document.getElementById("outcome").appendChild(txt);
    }
    else{
      var txt = document.createTextNode("PIDs");
      document.getElementById("pids-title").appendChild(txt);
      for(var i = 0; i < authenticated.length; i++){
        var node = document.createElement("li");
        var txt = document.createTextNode(authenticated[i]);
        node.appendChild(txt);
        document.getElementById("pids").appendChild(node);
      }
      var txt = document.createTextNode("there are " + resp.nymiband.length + " Nymi Bands in the area, " + authenticated.length + " provisioned");
      document.getElementById("outcome").appendChild(txt);
    }
  }
}

