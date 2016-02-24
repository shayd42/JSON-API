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


console.log("provisioning sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

/*

  Provisioning is a multistep process:
    1/ Enable provisioning immediately upon connecting.
    2/ waitForDiscovery -- wait until a nymi band begins provisioning
    3/ waitForPattern -- wait until we have a pattern, for this demo we'll
       pretend the user confirmed the pattern.
    4/ waitForProvisioned -- wait for confirmation of successful provisioning

   In this demo, these steps are implemented by different napiServer.onmessage
   event handlers. As we move from step to step we simply re-assign onmessage.
   This is not particularly robust, but it makes it clearer what's going on. If
   there's an error there's no recovery using this technique in the simple way
   we are.

*/

napiServer.onopen = function(){
  var req = {
    op: "provision",
    subop: "run",
    exchange: "*provisioning*",
    discoveryEnabled: true
  };

  napiServer.send(JSON.stringify(req));
}

napiServer.waitForDiscovery = function (event) {
  var notice = JSON.parse(event.data);
  if (("provision" == notice.op) && ("notification_discovered" == notice.subop)) {
    // This is telling us that some nymi band has begun it's provisioning process.
    // Wait to be informed of the LED pattern displayed on the nymi band
    console.log("notification_discovered", notice);
    napiServer.onmessage = napiServer.waitForPattern;
  }
  else {
    console.log("ignoring (1)", notice);
  }
}

napiServer.waitForPattern = function(event){
  var notice = JSON.parse(event.data);
  if(("provision" == notice.op) && ("notification_patterns" == notice.subop)){
    // This is telling us of a LED pattern displayed on a nymi band. If more than one
    // nymi band is provisioning then there will be more than one pattern reported.
    // We'll choose the first pattern and pretend that we've confirmed with the user
    // that this is the pattern -- DO NOT do this in a real NEA, we're cheating for demo
    // purposes!
    console.log("notification_patterns", notice);

    var arbitrarilyChosenPattern = notice.patterns[0];
    console.log("using pattern:", arbitrarilyChosenPattern);

    // Inform the NEA that the user has confirmed this LED pattern.
    var req = {
      op: "provision",
      subop: "pattern",
      exchange: "*provisioning*",

      pattern: arbitrarilyChosenPattern
    };

    napiServer.send(JSON.stringify(req));

    // now wait for confirmation of a successful provisioning
    napiServer.onmessage = napiServer.waitForProvisioned;
  }
  else{
    console.log("ignoring (2)", notice);
  }
}

napiServer.waitForProvisioned = function(event){
  var notice = JSON.parse(event.data);
  if(("provision" == notice.op) && ("notification_provisioned" == notice.subop)){
    // This is telling us that provisioning has succeeded and what the new pid is.
    console.log("notification_provisioned", notice);
    console.log("PROVISIONED:", notice.pid);

    var req = {
      op: "provision",
      subop: "stop",
      exchange: "*provisioning*",
    };

    napiServer.send(JSON.stringify(req));
    napiServer.onmessage = napiServer.doNothing;

    /*
    // now wait to see if another nymi band begins provisioning
    napiServer.onmessage = napiServer.waitForDiscovery;
    */
  }
  else{
    console.log("ignoring (3)", notice);
  }
}

napiServer.doNothing = function(event){
  var data = JSON.parse(event.data);
  console.log("ignoring (4)", data);
}

napiServer.onmessage = napiServer.waitForDiscovery;

