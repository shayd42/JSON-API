
console.log("watch sample");

// open a websocket to the napi service
var napiServer = new WebSocket("wss://127.0.0.1:11000/napi");

napiServer.onopen = function(){
  var req = {
    op: "notifications",                // To configure the notifications, the op is 'notifications' and the subop is 'set'
    subop: "set",
    exchange: "*notifications*",        // Notifications will have this value set, its value can be anything, but something well known is probably best

    notificationsEnabled: {
      onFoundChange: true,              // enable notifications of Found state changes (details of found state are in the readme)
      onPresenceChange: true,           // enable notifications of Presence changes (details of presence state are in the readme)
      onProvision: true                 // enable notifications of successful provisons
    }
  };

  napiServer.send(JSON.stringify(req));
}

napiServer.onmessage = function(event){
  var msg = JSON.parse(event.data);
  // filter all incoming messages and show only the notifications/report events
  if(("notifications" == msg.op) && ("report" == msg.subop)){
    var ts = (new Date()).toISOString();
    for (var notificationName in msg.notification) {
      if (msg.notification.hasOwnProperty(notificationName)) {
       console.log("notification", ts, notificationName, msg.notification[notificationName]);
      }
    }
  }
}

