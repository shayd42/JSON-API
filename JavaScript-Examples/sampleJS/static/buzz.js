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

console.log("buzz (aka notify) sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function () {
  napiServer.buzzThem();
}

napiServer.buzzThem = function () {
  var req = {
    op: "info",                         // To request info, the op is 'info' and the subop is 'get'
    subop: "get",
    exchange: "exchange-" + Date.now()  // this is a unique value to match a response to a request
  };

  var theSpinner = document.getElementById("the-spinner");
  theSpinner.className = "glyphicon glyphicon-refresh spinning";

  napiServer.send(JSON.stringify(req));
  napiServer.onmessage = napiServer.requestBuzz;
}

napiServer.requestBuzz = function (event) {
  var authenticated = JSON.parse(event.data).provisionsPresent;
  var n = authenticated.length;

  napiServer.onmessage = napiServer.waitForOutcomes;

  for (var i = 0; i < n; i++) {
    var req = {
      op: "notify",
      subop: "run",
      exchange: "exchange-sign-" + authenticated[i] + "-" + Date.now(),
      pid: authenticated[i],
      //notification: (i % 2) ? "positive" : "negative" // can be true and false as well
      notification: (0.5 < Math.random()) ? "positive" : "negative" // can be true and false as well
    }
    napiServer.send(JSON.stringify(req));
  }
}

napiServer.waitForOutcomes = function (event) {
  var outcome = JSON.parse(event.data);

  if (("notify" == outcome.op) && ("run" == outcome.subop)) {
    var theSpinner = document.getElementById("the-spinner");
    theSpinner.className = "hidden glyphicon glyphicon-refresh";

    if(outcome.successful){
      console.log("pid:", outcome.pid, "received a", outcome.notification, "notification")
      var ts = (new Date()).toISOString();
      var tr = document.createElement("tr");

      napiServer.addCell(tr, ts);
      napiServer.addCodeCell(tr, outcome.pid);
      napiServer.addCell(tr, outcome.notification);

      var body = document.getElementById("buzz");
      body.insertBefore(tr, body.childNodes[0]);
    }
    else{
      console.log("FAILED notification:", outcome)
      var ts = (new Date()).toISOString();
      var tr = document.createElement("tr");

      napiServer.addCell(tr, ts);
      napiServer.addCodeCell(tr, outcome.pid);
      napiServer.addCell(tr, "failed");

      var body = document.getElementById("buzz");
      body.insertBefore(tr, body.childNodes[0]);
    }
  }
  else {
    console.log("ignoring message:", outcome);
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

