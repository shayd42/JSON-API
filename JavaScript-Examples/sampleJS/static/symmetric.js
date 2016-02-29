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

console.log("get symmetric keys (unguarded) sample");

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
  var authenticated = JSON.parse(event.data).provisionsPresent;
  console.log("authenticated or identified provisions:", authenticated);
  var n = authenticated.length;

  napiServer.onmessage = napiServer.waitForOutcomes;

  for (var i = 0; i < n; i++) {
    var req = {
      op: "getSymmetricKey",
      subop: "run",
      exchange: "exchange-sign-" + authenticated[i] + "-" + Date.now(),
      pid: authenticated[i],
      guarded: false
    }
    napiServer.send(JSON.stringify(req));
    console.log(i, "getting symmetric keys for:", authenticated[i])
  }

}

napiServer.waitForOutcomes = function (event) {
  var outcome = JSON.parse(event.data);

  if (("getSymmetricKey" == outcome.op) && ("run" == outcome.subop)) {
    if(outcome.successful){
      console.log("pid:", outcome.pid)
      console.log("  key  :", outcome.key)
      console.log("  keyId:", outcome.keyId)
    }
    else{
      console.log("FAILED to get the symmetric keys:", outcome)
    }
  }
  else {
    console.log("ignoring message:", outcome);
  }
}


