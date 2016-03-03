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
  napiServer.genRandom();
}

napiServer.genRandom = function () {
  var req = {
    op: "info",                         // To request info, the op is 'info' and the subop is 'get'
    subop: "get",
    exchange: "exchange-" + Date.now()  // this is a unique value to match a response to a request
  };

  var theSpinner = document.getElementById("the-spinner");
  theSpinner.className = "glyphicon glyphicon-refresh spinning";

  napiServer.send(JSON.stringify(req));
  napiServer.onmessage = napiServer.requestRandom;
}

napiServer.requestRandom = function (event) {
  var authenticated = JSON.parse(event.data).provisionsPresent;
  var n = authenticated.length;

  napiServer.onmessage = napiServer.waitForOutcomes;

  for (var i = 0; i < n; i++) {
    var req = {
      op: "random",
      subop: "run",
      exchange: "exchange-random-" + authenticated[i] + "-" + Date.now(),
      pid: authenticated[i]
    }
    napiServer.send(JSON.stringify(req));
  }

}

napiServer.waitForOutcomes = function (event) {
  var outcome = JSON.parse(event.data);

  if (("random" == outcome.op) && ("run" == outcome.subop)) {
    var theSpinner = document.getElementById("the-spinner");
    theSpinner.className = "hidden glyphicon glyphicon-refresh";
    if(outcome.successful){
      var ts = (new Date()).toISOString();
      var tr = document.createElement("tr");

      napiServer.addCell(tr, ts);
      napiServer.addCodeCell(tr, outcome.pid);
      napiServer.addCodeCell(tr, outcome.pseudoRandomNumber);

      var body = document.getElementById("prns");
      body.insertBefore(tr, body.childNodes[0]);
    }
    else{
      var ts = (new Date()).toISOString();
      var tr = document.createElement("tr");

      napiServer.addCell(tr, ts);
      napiServer.addCodeCell(tr, outcome.pid);
      napiServer.addCell(tr, "failed");

      var body = document.getElementById("prns");
      body.insertBefore(tr, body.childNodes[0]);
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

napiServer.clear = function(){
  var body = document.getElementById("prns");
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
}

