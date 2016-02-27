 
##JavaScript Sample Code for Desktop

This is the sample code demonstrating the JSON API v3.1beta2 over secure websockets (WSS). The samples are fragments of code illustrative of the use of the JSON API to obtain specific outcomes. They don't constitute an *application* per se. And there's no real attempt to handle errors or unexpected situations.

These samples require a recent version of the Chrome browser. All samples except the roaming authentication samples will work with FireFox. Neither Safari nor IE will work because neither will allow self-signed TLS certs to be used for the WSS connections. 

To experiment with the samples:

1. **[Download and unpack the Nymi SDK](https://www.nymi.com/get_started)** for your platform, either Windows or Mac OS X (10.10 or 10.11)
1. Clone the this repository
1. Have a terminal open and make your sure current working directory is this directory
1. Have a recently updated installation of the Chrome browser
1. The Nymulator is running.

## Running the Nymulator

We strongly suggest that your initial experiments with these JavaScript samples be done against the Nymulator. The Nymulator simulates up to six Nymi Bands and is intended to facilitate the development of NEAs. [The use of the Nymulator is described here.](https://downloads.nymi.com/sdkDoc/doc-v3.1.5.326-326_5df03a4/index.html#using-the-nymulator)

### OS X Nymulator Considerations

You might want to move the Nymulator.app distributed with the SDK into your `/Applications` directory.

On OS X, "app nap" is on for the Nymulator. "App Nap" is a power saving optimisation of OS X that puts applications that are not visible into a suspended state (i.e. made to 'nap') where they are not using the CPU. The Nymulator must generate a continuous stream of events in order to simulate actual Nymi Bands. If the Nymulator is napping it can't generate these events and the JSON NAPI process will assume all the simulated Nymi Bands have "gone away". On some OS X machines the Nymulator must actually be *active,* which is totally impractical. App nap can be disabled for the Nymulator, as it can be for most applications on OS X, by executing the following line on a terminal:

```bash
defaults write com.Nymi.Nymulator NSAppSleepDisabled -bool YES
```

We'll deal with this in a future release of the SDK.

## Running the WSS NAPI Process

There are executables distributed with the SDK for Windows and OS X. These are intended to be used from the command line as there are arguments required. The command line arguments are the same for both Windows and OS X. If you double click on the executables they won't work properly.

### Windows

There is a single executable, `napi-wss-net.exe` and several DLLs distributed with the SDK.

### OS X

There are two executables: `napi-wss` and `napi-wss-nymulator`

### Running

```
napi-wss(-nymulator) v3.1beta2: a single application websocket based NAPI server

    Usage:
      napi-wss            <nea-directory> [--websocket=<addr>] [--log=<file>] [--verbose | --be-very-verbose]
      napi-wss            (-h | --help)
      napi-wss            --version

    Options:
      <nea-directory>     Root directory of the Nymi Enabled Application
      --websocket=<addr>  Address on which to listen for websocket connections [default: 127.0.0.1:11000].
      --log=<file>        The log file to append to (relative paths from <nea-directory>) [default: napi-wss.log].

      --verbose           Be verbose.
      --be-very-verbose   Be very verbose.

      --version           Show version.
      -h --help           Show this information.
```

## ------------------------------------------------------------------------------------

There are executables distributed with this release, one for Windows API, and two for Mac API. [Download the SDK package here](https://www.nymi.com/dev) and unpack the archive in this directory (a subdirectory API-Windows-v3.1.4 or API-Mac-v3.1.4 will be created).

The single windows executable allows the NEA to connect to both physical Nymi Bands and the Nymulator. On Mac, different executables are needed to connect with either physical Nymi Bands or the Nymulator.

Make sure that executable is placed in the root folder of the samples (same folder as go.sh go.bat etc.)

To run on windows you may need to install [Visual C++ Redistributable for Visual Studio 2015](https://www.microsoft.com/en-ca/download/details.aspx?id=48145)

To Communicate with the Nymi Band on Windows Nymi API is using NBS (Nymi Bluetooth Service). To install NBS download and install [Nymi Lock Control](https://www.nymi.com/got-downloads/?dl=f)

If you are switching between Nymi Band and Nymulator make sure you stop NymiBluetoothService for Nymulator and start it again for Nymi Band. 

The executable is a command line program in this release. Here are the options:

    napi-server(-net): a single application websocket based NAPI server

        Usage:
          napi-server app                [<app-directory>] --websocket-port=<websocket-port>
                                         [--verbose | --be-very-verbose]
          napi-server nymulator          [<app-directory>] --websocket-port=<websocket-port> 
                                         [--port=<port>] [--host=<host>] [--verbose | --be-very-verbose]
          napi-server                    (-h | --help)
          napi-server                    --version

        Options:
          <app-directory>                Root directory of the application [default: "."].
          --websocket-port <wsport>      Port on which to listen for websocket connections [default: 11000].

          --port <port>                  Nymulator port to use [default: 9089].
          --host <host>                  Nymulator host to use [default: 127.0.0.1].

          --verbose                      Be verbose.
          --be-very-verbose              Be very verbose.
          --version                      Show version.
          -h --help                      Show this information.

The sample apps can be run with one of the following OS X command lines:

    ./napi-server app play --websocket-port=11000
    ./napi-server-net nymulator play --websocket-port=11000
    
And for windows:

    napi-server-net.exe app play --websocket-port=11000
    napi-server-net.exe nymulator play --websocket-port=11000
    
The `play` directory contains a simple config.json file, and after executing will contain a provisions.json file.

```json
{
  "neaName" : "play-app",
  "sigAlgorithm" : "NIST256P",
  "automaticFirmwareVersion" : false
}
```

The `neaName` is only used for some reporting at this time, it will be more important in future releases. It should be named appropriately for your NEA, and must be between 6 and 18 simple ascii characters in length — no unicode, sorry.

The `sigAlgorithm` is the default algorithm to use for signing, the choices are `NIST256P` or `SECP256K`.

If `automaticFirmwareVersion` is `true` (a boolean JSON value, not a string) then whenever a Nymi Band appears the napi-server will attempt to determine its firmware version. This is not normally needed by the NEA and so is `false` by default.

It is possible to have several napi-servers running simultaneously, but they must be running from different app-directories. To create an app directory just copy the play directory someplace (and remove the provisions.json file)

The static directory, in this release, must be in the same directory as where the executable is run from. It expects to serve html and JavaScript files found in that directory. As you experiment with NAPI you can put your scripts into this directory.

There's no difficulty with having different instances of the napi-server running from the same directory and so sharing the static directory. The napi-server never writes to this directory so there's no risk of conflicting changes.

## ------------------------------------------------------------------------------------

* Make sure the [NAPI service is running (see below)](#running-the-napi-service). You can run the go and go-nymulator scripts provided, however, they require the API executable to be in the API-Windows-v3.1.4 or API-Mac-v3.1.4 directory. 

* The sample code is intended to run in a browser. Currently Chrome and Firefox browsers are supported on both Windows and Mac. IE and Safari are not supported because of the way they restrict the use of self-signed SSL certs.

* The sample app uses the JavaScript console, so make sure you've got that open and visible.
    
    (Chrome Mac: View >> Developer >> JavaScript Console; Firefox: Tools >> Web Developer >> Web Console)
    
    (Chrome Windows: upper right corner menu -> More Tools -> Developer Tools or Ctrl + Shift + I)

* Sample code accesses WSS API at [https://127.0.0.1:11000](https://127.0.0.1:11000) by default.

* We are using self-signed certs for SSL and we've included some in the release -- **do not** use these for real NEAs. Using self-signed certs means that you will be warned about security issues and will have to allow access to the page on first use. 

* Once you have WSS API executable running make sure you click [https://127.0.0.1:11000](https://127.0.0.1:11000) once and accept the certificate warning (sample code will not work without it with no warnings given to the user)

##info — describe information about Nymi Bands in the vicinity

The following JSON object illustrates a simple response to a request for information about Nymi Bands currently in the vicinity. The information provided will be changing in subsequent releases. There's no information included about provisioned Nymi Bands that are not in the vicinity. The information that is provided is excessive and somewhat redundant. The important parts are (after a bit of manual editing):

```json
{       
  "devices": [
    { 
      "RSSI": -60,
      "RSSIsmoothed": -60,
      "handle": 2,
      "provisioned": false,
      "state": {
        "found": "anonymous",
        "present": "yes"
      } 
    },
    { 
      "RSSI": -60,
      "RSSIsmoothed": -60,
      "handle": 1,
      "id": "b14542c3eb814a1dfe7ce6060e865913",
      "key": "9018070e29afb73bb954a73c15a2df09",
      "provisioned": true,
      "state": {
        "found": "authenticated",
        "present": "yes"
      }
    }
  ]
}
```

##peek — list provision ids of all currently authenticated Nymi Bands

Peek is similar to the info sample, but it returns information for provisioned devices only. The information is printed to the JavaScript console.

##watch — show changes to state of Nymi Bands in the vicinity

Watch sets up notifications for:

* onFoundChange
* onPresenceChange
* onProvision

It will watch indefinitely for any changes and report them to the console as they happen.

The `onFoundChange` and `onPresenceChange` are notifications of state change.

Found state can be any one of:
* authenticated – the Nymi Band is provisioned and authenticated to this NEA, and is present (see below)
* identified – the Nymi Band identifies itself as being provisioned and present, but this remains unconfirmed
* provisioning – the Nymi Band is provisioning with some NEA
* unprovisionable – the Nymi Band is known not to be provisionable, which usually means that it is at its provision limit
* anonymous – the Nymi Band has not been provisioned by this NEA
* discovered – a transient state that will either move to anonymous, identified, or authenticated
* unclasped – the Nymi Band was present when it was unclasped
* undetected – the Nymi Band was present but it no longer is

Presence state can be any one of:
* yes – this NEA has received an update from the Nymi Band within the last 5 seconds (usually much more recently than that)   
* likely – this NEA has *not* received an update from the Nymi Band for at least 5 seconds
* unlikely – this NEA has *not* received an update from the Nymi Band for at least 15 seconds
* no – this NEA has *not* received an update from the Nymi Band for at least 60 seconds

The `onProvision` notification is an alternative way to receive confirmation of a successful provisioning. You're still notified directly as illustrated by the provisioning sample.

##provision — provision a Nymi Band

The provisioning process requires a user confirmation stage that can be implemented in two ways:

1. The user enters the LED pattern visible on their Nymi Band into the NEA

1. The user selects or confirms the LED pattern. In order to do this the NEA must be informed of known LED patterns.

The sample code selects one of the LED pattern reported (instead of asking the user to choose) and confirms that to the NEA. Since the samples run in a browser with output to the JavaScript console, input isn't possible so the sample code 'pretends' the user chose. This trick is *totally unsuitable* for a real NEA.

#Running the NAPI Service


#Known Issues

1. In this release there is a server running the Nymi API communicating to a browser window using JSON over a secure websocket. The NEA is actually the server, not the browser window. This is somewhat counterintuitive and may lead to some confusion. It's possible to connect multiple browsers simultaneously to the napi server. This works, but should be considered a multiple window user interface to a single application. The samples make no attempt to do this "right". If you run two instances of provisioning sample you will almost certainly encounter unexpected behaviour. On the other hand, you can have as many windows running the watch, peek, and info sample apps as you wish, even concurrently with a *single* provisioning instance.

1. If you put a Nymi Band into provisioning mode before an NEA has enabled provisioning it is very likely that NAPI will, incorrectly, not recognise that the Nymi Band is provisioning.

1. The napi-server may start using a lot of CPU (100% of one core). This is a bug. When this happens you should restart the napi-server. Sometimes the napi-server stops responding, in this case the only thing to do is restart.

1. The information provided to the info request is both excessive (uninteresting, redundant) and incomplete (does not report on not present provisioned Nymi Bands)

1. Overly complicated command line options when starting the napi-server

1. Does not always cleanup its allocated memory on exit, this is not a problem other than it messes up memory leak detection tools.

1. If a websocket connection fails during execution of a command sequence (e.g. provisioning), reconnecting may not be sufficient to recover.

1. The sample code does not illustrate all functionality

1. Multiple simultaneous connections are allowed without restriction. The intention was to allow re-connections, but the potential utility of this is high and so we want to support it properly in future releases.

1. On OS X, "app nap" is on for the Nymulator. This means that it must be in the foreground (i.e. visible) for it to work properly. App nap can be disabled for the Nymulator, as it can be for most applications on OS X (e.g. running `defaults write com.Nymi.Nymulator NSAppSleepDisabled -bool YES` from a terminal)

1. When unclasping a Nymi Band in the Nymulator, you must wait at least 6 seconds before reclasping the band again. If you don't wait the re-clasp will not be recognised properly. The Nymulator should be preventing this and will in a future release.

1. As part of the Nymi Band's privacy guarantees, every 15 minutes it will change its bluetooth advertising details, and so appear to be a new device to all NEAs. If that happens during an operation (e.g. provisioning), then there's a possibility that the NEA gets confused between the old device and new device and the operation will fail. If this happens, simply retry the operation.
 
1. On Windows, when using ctrl+c to kill the Windows Example app, napi-server-net.exe will cause a crash instead of exiting cleanly. This does not occur when the command-prompt/terminal is simply closed.

