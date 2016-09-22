# Nymi SDK 4.0 

Release Date: September 2016

## Release Overview

The Nymi SDK has changed significantly since the previous release. 

* In SDK 4.0, the Nymi JSON API now runs as an in-process static library, instead of as a websocket server as in SDK 3.1. 
* The JSON protocol has also changed. For details, see the [Nymi JSON API Reference](http://downloads.nymi.com/sdkDoc/latest/jsonreference/index.html) documentation.
* SDK 4.0 also includes support for a new Bluetooth® advertisement protocol that enhances performance and reliable communication with the Nymi Band.
* SDK 4.0 Documentation is available at: http://downloads.nymi.com/sdkDoc/latest/index.html

Nymi-enabled applications (NEAs) written with SDK 3.1 must be updated to account for the new in-process library and the JSON protocol changes.


## Known Issues 

### Detecting State Changes:

*Important:* After provisioning a Nymi Band, an NEA *must* wait for an `onFoundChange` event containing the provision ID (`pid`) of the target Nymi Band *and* an `after` state of `Found::Authenticated` *before* it attempts any other provision-specific actions on the Nymi Band. <br>
When an `onFoundChange` `after` state of any value other than `Found::Authenticated` is received, the NEA must stop attempting any provision-specific actions.

* The `onPresenceChange` notification is triggered when the *presence* state of a Nymi Band changes. Presence indicates whether a Bluetooth advertisement has been received from the Nymi Band and how recently. Therefore, the `authenticated` attribute of the `onPresenceChange` notification may indicate an unauthenticated Nymi Band, even if the Nymi Band then immediately authenticates. <br>
In order to properly detect a newly-authenticated Nymi Band, the NEA should rely on the `onFoundChange` callback.





