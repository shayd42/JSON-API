# Nymi JSON API (Release 3.1 Beta 2)

[Nymi](https://www.nymi.com) supports a JSON based API for the development of Nymi Enabled Applications (NEAs) that can take advantage of the [authentication and cryptographic capabilities](https://downloads.nymi.com/sdkDoc/doc-v3.1.5.326-326_5df03a4/index.html#bound-authenticator) of the Nymi Band. Initially we are providing secure websocket servers for Mac OS X and Windows with JavaScript samples that can be run in the Chrome browser. There are also native client libraries and sample applications for [Android](https://github.com/Nymi/Android-API) and (very soon) iOS.

The [SDK documentation](https://downloads.nymi.com/sdkDoc/doc-v3.1.5.326-326_5df03a4/index.html), [FAQs](https://nymi.zendesk.com/hc/en-us), and [the wiki is a User Guide](https://github.com/Nymi/JSON-API/wiki) for the JSON API and JavaScript samples.

The [SDK documentation]( https://downloads.nymi.com/index.html), [FAQs](https://nymi.zendesk.com/hc/en-us), and [the wiki is a User Guide](https://github.com/Nymi/JSON-API/wiki) for the JSON API and JavaScript samples.

This repository contains the JavaScript samples that show how to use the core functionality of the JSON API.  In order to experiment with the JSON API you will need the websocket server and Nymulator:

**[Download the most recent SDK release.](https://github.com/Nymi/JSON-API/releases)** 

The SDK releases contain a snapshot of this repository but the most up-to-date information and samples will be here. We suggest you work from a clone or fork of this repository.

To use Nymi's [Roaming Authentication](https://downloads.nymi.com/sdkDoc/doc-v3.1.5.403-403_1d2a591/index.html#roaming-authenticator) capabilities, you must develop a roaming authentication server. This is a non-trivial effort requiring careful consideration of security implications. Nymi provides an experimental implementation of a [roaming authenticator](https://github.com/Nymi/roaming-authenticator). This is an illustration of how you might go about writing one and is useful while developing NEAs, but it is inadequate for production use (its security and error handling is weak, its persistence mechanism is not robust, its user model is trivial, it takes no consideration of your specific execution environment, it allows any NEA to access it, and it's probably buggy too but we don't know because it's not been sufficiently tested). The JavaScript samples use this authenticator.

It is possible to write client libraries in other languages than JavaScript. For example, Nymi's [Android API](https://github.com/Nymi/Android-API) is written in Java, and Nymi's functional tests are written in Ruby.