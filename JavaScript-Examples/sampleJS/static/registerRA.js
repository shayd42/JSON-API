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

console.log("enable roaming authentication sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function () {
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", napiServer.waitForPublicKey);
      oReq.open("GET", "https://127.0.0.1:9999/public-key")
			oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			oReq.send();
}

napiServer.waitForPublicKey = function () {
  pkResponse = JSON.parse(this.responseText);
	if(pkResponse.okay){
    napiServer.publicKey = pkResponse['public-key']
		console.log("got public key successfully", pkResponse);

    var req = {
      op: "info",                         // To request info, the op is 'info' and the subop is 'get'
      subop: "get",
      devices: true,                      // we want information about any nymi bands in the vicinity
      exchange: "exchange-" + Date.now()  // this is a unique value to match a response to a request
    };
  
    napiServer.send(JSON.stringify(req));
	}
	else{
		console.log("failed to get public key", pkResponse);
	}

}

napiServer.onmessage = function (event) {
  var authenticated = JSON.parse(event.data).provisionsPresent;
  console.log("authenticated or identified provisions:", authenticated);
  var n = authenticated.length;

  napiServer.onmessage = napiServer.waitForOutcomes;

  for (var i = 0; i < n; i++) {
    var req = {
      op: "genRoamingKeys",
      subop: "run",
      exchange: "exchange-" + authenticated[i] + "-" + Date.now(),
      pid: authenticated[i],
      partnerPublicKey: napiServer.publicKey
    }
    console.log("send to napiServer:", req);
    napiServer.send(JSON.stringify(req));
  }

}

napiServer.waitForOutcomes = function (event) {
  var outcome = JSON.parse(event.data);

  if (("genRoamingKeys" == outcome.op) && ("run" == outcome.subop)) {
    if(outcome.successful){
			var registration = {
				'verification-key-id': outcome.nymibandVerificationKeyId,
				'verification-key': outcome.nymibandVerificationKey,
				'user-data': {
					'name': 'someone'+outcome.pid
				}
			}
      console.log("register:", registration)

      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", napiServer.waitForRAServer);
      oReq.open("POST", "https://127.0.0.1:9999/register")
			oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			oReq.send(JSON.stringify(registration));
			//console.log("registration JSON", JSON.stringify(registration));
    }
    else{
      console.log("pid:", outcome.pid, outcome.outcome)
    }
  }
  else {
    console.log("ignoring message:", outcome);
  }
}

napiServer.waitForRAServer = function () {
  raResponse = JSON.parse(this.responseText);
	if(raResponse.okay){
		console.log("registered successfully", raResponse);
	}
	else{
		console.log("failed to registered", raResponse);
	}
}

