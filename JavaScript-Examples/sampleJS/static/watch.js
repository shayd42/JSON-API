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


console.log("watch sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function(){
  napiServer.subscribe();
}

napiServer.subscribe = function(){
  var req = {
    op: "notifications",                // To configure the notifications, the op is 'notifications' and the subop is 'set'
    subop: "set",
    exchange: "*notifications*",        // Notifications will have this value set, its value can be anything, but something well known is probably best

    notificationsEnabled: {
      onFoundChange: document.getElementById("on-found-change").checked,
      onPresenceChange: document.getElementById("on-presence-change").checked,
      onProximityChange: document.getElementById("on-proximity-change").checked,

      onFirmwareVersion: document.getElementById("on-firmware-version").checked,
      onNewNymiNonce: document.getElementById("on-new-nymi-nonce").checked,
      onProvision: document.getElementById("on-provision").checked,
      onApproached: document.getElementById("on-approached").checked,

      onFound: document.getElementById("on-found").checked,
      onDetected: document.getElementById("on-detected").checked,
    }
  };

  console.log("subscription request", req)

  napiServer.send(JSON.stringify(req));
}

napiServer.onmessage = function(event){
  var msg = JSON.parse(event.data);
  // filter all incoming messages and show only the notifications/report events
  if(("notifications" == msg.op) && ("report" == msg.subop)){
    for (var notificationName in msg.notification) {
      if (msg.notification.hasOwnProperty(notificationName)) {
        var ts = (new Date()).toISOString();
        var tr = document.createElement("tr");

        napiServer.addCell(tr, ts);
        napiServer.addCell(tr, msg.notification[notificationName].tid);
        napiServer.addCodeCell(tr, msg.notification[notificationName].pid);
        napiServer.addCell(tr, notificationName);
        napiServer.addCell(tr, msg.notification[notificationName].before);
        napiServer.addCell(tr, msg.notification[notificationName].after);

        var body = document.getElementById("notifications")
        body.insertBefore(tr, body.childNodes[0]);

        console.log("notification", ts, notificationName, msg.notification[notificationName]);
      }
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

napiServer.clearNotifications = function(){
  var body = document.getElementById("notifications");
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
}

