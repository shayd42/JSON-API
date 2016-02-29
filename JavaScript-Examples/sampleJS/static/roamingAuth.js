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

console.log("roaming authentication sample");

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
  var nymiband = JSON.parse(event.data).nymiband;
  console.log("nymibands:", nymiband);
  var n = nymiband.length;

  napiServer.onmessage = napiServer.waitForOutcomes;

  for (var i = 0; i < n; i++) {
    if ("yes" != nymiband[i].present) continue;

		var sign = {
      tid: nymiband[i].tid,
      'nymiband-nonce' : nymiband[i].nymibandNonce
		}

    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", napiServer.waitForRAServer);
    oReq.open("POST", "https://127.0.0.1:9999/sign");
		oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		oReq.send(JSON.stringify(sign));
    console.log("The server has been requested to roaming authenticate adv-nonce", i, nymiband[i].tid, sign);

    /*
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", napiServer.waitForRAServerOld);
    oReq.open("GET", "https://127.0.0.1:9998/query/" + nymiband[i].tid + "/" + nymiband[i].nymibandNonce);
    oReq.send();
    console.log("The server has been requested to roaming authenticate adv-nonce", i, nymiband[i].nymibandNonce, nymiband[i].present);
    */
  }
}

napiServer.waitForRAServer = function () {
  raResponse = JSON.parse(this.responseText);
  console.log("RA Server response: ", raResponse);
  if (raResponse.okay) {
    req = {
      op: "roamingAuthentication",
      subop: "run",
      exchange: "exchange-" + raResponse['nymiband-nonce'] + "-" + raResponse.tid,

      tid: raResponse.tid,
      partnerPublicKey: raResponse['public-key'],
      nymibandNonce: raResponse['nymiband-nonce'],
      serverNonce: raResponse['server-nonce'],
      serverSig: raResponse['server-signature'],
    }

    var raReq = JSON.stringify(req);
    napiServer.send(raReq);
    console.log("the nymiband has been asked to verify the server signature and then provide it's own signature")
    console.log(req);
  }
  else{
    console.log("the roaming authenticator sign request failed:", raResponse['error-message'])
  }
}

napiServer.waitForOutcomes = function (event) {
  var outcome = JSON.parse(event.data);

  if (("roamingAuthentication" == outcome.op) && ("run" == outcome.subop)) {
    if(outcome.successful){
      console.log("The nymiband has accepted roaming authentication, server needs to be consulted for final confirmation")
      console.log(outcome)

		  var confirmation = {
        tid: outcome.tid,
        'server-nonce' : outcome.serverNonce,
        'verification-key-id' : outcome.nymibandVerificationKeyId,
        'nymiband-signature' : outcome.nymibandSig,
        'confirming-nea' : "there is no particular NEA to identify in these samples"
		  }

      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", napiServer.waitForRAConfirmation);
      oReq.open("POST", "https://127.0.0.1:9999/confirm");
		  oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		  oReq.send(JSON.stringify(confirmation));
      console.log("The server has been requested to confirm roaming authentication", confirmation);
    }
    else{
      if(outcome.nymibandNonceChanged){
        console.log("roaming authenticate failed because the nymiband nonce changed, try again")
      }
      else{
        console.log("FAILED to roaming authenticate", outcome)
      }
    }
  }
  else {
    console.log("ignoring message:", outcome);
  }
}

napiServer.waitForRAConfirmation = function () {
  raResponse = JSON.parse(this.responseText);
  if (raResponse.okay) {
    console.log("RA confirmed: ", raResponse);
  }
  else{
    console.log("RA confirmation failed: ", raResponse);
  }
}

