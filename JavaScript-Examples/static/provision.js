
console.log("peek sample");

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

napiServer.waitForDiscovery = function(event){
  var notice = JSON.parse(event.data);
  if(("provision" == notice.op) && ("discovered-notification" == notice.subop)){
    // This is telling us that some nymi band has begun it's provisioning process.
    // Wait to be informed of the LED pattern displayed on the nymi band
    console.log("discovered-notification", notice);
    napiServer.onmessage = napiServer.waitForPattern;
  }
  else{
    console.log("ignoring", notice);
  }
}

napiServer.waitForPattern = function(event){
  var notice = JSON.parse(event.data);
  if(("provision" == notice.op) && ("patterns-notification" == notice.subop)){
    // This is telling us of a LED pattern displayed on a nymi band. If more than one
    // nymi band is provisioning then there will be more than one pattern reported.
    // We'll choose the first pattern and pretend that we've confirmed with the user
    // that this is the pattern -- DO NOT do this in a real NEA, we're cheating for demo
    // purposes!
    console.log("patterns-notification", notice);

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
    console.log("ignoring", notice);
  }
}

napiServer.waitForProvisioned = function(event){
  var notice = JSON.parse(event.data);
  if(("provision" == notice.op) && ("provisioned-notification" == notice.subop)){
    // This is telling us that provisioning has succeeded and what the new provisionId is.
    console.log("provisioned-notification", notice);
    console.log("PROVISIONED:", notice.provisionId);

    // now wait to see if another nymi band begins provisioning
    napiServer.onmessage = napiServer.waitForDiscovery;
  }
  else{
    console.log("ignoring", notice);
  }
}

napiServer.onmessage = napiServer.waitForDiscovery;

