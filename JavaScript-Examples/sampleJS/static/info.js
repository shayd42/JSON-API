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


console.log("info sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function(){
  napiServer.getInfo();
}

napiServer.getInfo = function(){
  var req = {
    op: "info",                         // To request info, the op is 'info' and the subop is 'get'
    subop: "get",
    exchange: "exchange-" + Date.now()  // this is a unique value to match a response to a request
  };

  napiServer.send(JSON.stringify(req));
}

napiServer.onmessage = function(event){
  var msg = JSON.parse(event.data);    // when we get the response, parse it into a JS object
  if("info" == msg.op){
    napiServer.clearInfo();

    var txt = document.createTextNode(JSON.stringify(msg, null, 2));
    document.getElementById("outcome").appendChild(txt);
    console.log("message: ", msg);

    for (var i = 0; i < msg.nymiband.length; i++) {
      var info = msg.nymiband[i];
      if(!info.provisioned){ continue; }

      var tr = document.createElement("tr");

      napiServer.addCell(tr, info.sinceLastContact.toFixed(2));
      napiServer.addCell(tr, info.tid);
      napiServer.addCodeCell(tr, info.pid);
      napiServer.addCell(tr, info.found);
      napiServer.addCell(tr, info.present);
      napiServer.addCell(tr, info.proximity);
      napiServer.addCell(tr, info.hasApproached);
      napiServer.addCell(tr, info.authenticationWindowRemaining.toFixed(1));
      napiServer.addCell(tr, "" + info.RSSI_last + "/" + info.RSSI_smoothed.toFixed(1));

      var body = document.getElementById("info")
      body.appendChild(tr, body.childNodes[0]);
    }
    for (var i = 0; i < msg.nymiband.length; i++) {
      var info = msg.nymiband[i];
      if(info.provisioned){ continue; }

      var tr = document.createElement("tr");

      napiServer.addCell(tr, info.sinceLastContact.toFixed(2));
      napiServer.addCell(tr, info.tid);
      napiServer.addCell(tr, "–");
      napiServer.addCell(tr, info.found);
      napiServer.addCell(tr, info.present);
      napiServer.addCell(tr, info.proximity);
      napiServer.addCell(tr, info.hasApproached);
      napiServer.addCell(tr, "–");
      napiServer.addCell(tr, "" + info.RSSI_last + "/" + info.RSSI_smoothed.toFixed(1));

      var body = document.getElementById("info")
      body.appendChild(tr, body.childNodes[0]);
    }
  }
}

napiServer.addCell = function(tr, txt){
  var td = document.createElement("td")
  var tnode = document.createTextNode(txt)
  td.appendChild(tnode);
  tr.appendChild(td);
}

napiServer.addCodeCell = function(tr, txt){
  var td = document.createElement("td")
  var code = document.createElement("code")
  var tnode = document.createTextNode(txt)
  code.appendChild(tnode);
  td.appendChild(code);
  tr.appendChild(td);
}

napiServer.clearInfo = function(){
  var body = document.getElementById("info");
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  var node = document.getElementById("outcome");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}


