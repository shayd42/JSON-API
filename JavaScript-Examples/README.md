 
##JavaScript Sample Code for Desktop

This is the sample code demonstrating the JSON API v3.1beta2 over secure websockets (WSS). The samples are fragments of code illustrative of the use of the JSON API to obtain specific outcomes. They don't constitute an *application* per se. And there's no real attempt to handle errors or unexpected situations.

These samples require a recent version of the Chrome browser. All samples except the roaming authentication samples will work with FireFox. Neither Safari nor IE will work because neither will allow self-signed TLS certs to be used for the WSS connections. 

**[You can read about the JSON API on the wiki.](https://github.com/Nymi/JSON-API/wiki)**

To experiment with the samples:

1. **[Download and unpack the Nymi SDK](https://www.nymi.com/get_started)** for your platform, either Windows or Mac OS X (10.10 or 10.11)
1. Clone or fork this repository
1. Have a terminal open and make your sure current working directory is this directory
1. Have a recently updated installation of the Chrome browser running
1. The Nymulator is running.

## Running the Nymulator

We strongly suggest that your initial experiments with these JavaScript samples be done against the Nymulator. The Nymulator simulates up to six Nymi Bands and is intended to facilitate the development of NEAs. [The use of the Nymulator is described here.](https://downloads.nymi.com/sdkDoc/doc-v3.1.5.326-326_5df03a4/index.html#using-the-nymulator)

### OS X Nymulator Considerations

You might want to move the `Nymulator.app` distributed with the SDK into your `/Applications` directory.

On OS X, "app nap" is on for the Nymulator. "App Nap" is a power saving optimisation of OS X that puts applications that are not visible into a suspended state (i.e. made to 'nap') where they are not using power consuming resources like the CPU. The Nymulator must generate a continuous stream of events in order to simulate actual Nymi Bands. If the Nymulator is napping it can't generate these events and the JSON NAPI process will assume all the simulated Nymi Bands have "gone away". On some OS X machines the Nymulator must actually be *active,* which is totally impractical. App nap can be disabled for the Nymulator, as it can be for most applications on OS X, by executing the following line on a terminal (you only have to do this once):

```bash
defaults write com.Nymi.Nymulator NSAppSleepDisabled -bool YES
```

We'll deal with this in a future release of the SDK.

## Running the WSS NAPI Process

There are executables distributed with the SDK for Windows and OS X. These are intended to be used from the command line as there are arguments required. The command line arguments are the same for both Windows and OS X. If you double click on the executables they won't work properly.

### Windows

There is a single executable, `napi-wss-net.exe` and several (MinGW) DLLs distributed with the SDK.

Either put the executable and all of its DLLs on your execution path, or specify the path when running the NAPI process.

To communicate with actual Nymi Bands you must run the Nymi Bluetooth Service (NBS). An installer for NBS is included in the SDK download. `napi-wss-net.exe` assumes that the version of NBS is the one included in the SDK.

The Nymulator and NBS cannot be running simultaneously, so if you want to run the Nymulator (which we recommend for experimenting with these JavaScript fragments) you will need to stop the NBS process. This will cause any NEAs you have running to stop working.

### OS X

There are two executables: `napi-wss` and `napi-wss-nymulator`. `napi-wss` uses Core Bluetooth to communicate with actual Nymi Bands, `napi-wss-nymulator` uses a different mechanism to communicate with the Nymulator.

Either put the executables on your path (add the directory to `$PATH`, or copy them to one of the usual places like `/usr/local/bin`, `~/bin`, or however you've got things set up)

### Running

[We recommend reading the wiki page 'How the API Works' before proceeding.](https://github.com/Nymi/JSON-API/wiki/How-the-API-Works)

So, assuming:

1. you've put the SDK executables on your path as discussed above
1. the Nymulator is running (now, _**before**_ you start the JSON NAPI process)
1. you've changed directories into the `JavaScript-Examples` directory of the cloned or forked `[github.com/Nymi/JSON-API](https://github.com/Nymi/JSON-API) repository.
1. you're running a recent version of Chrome, and you've opened Chrome's JavaScript Console. The JavaScript samples write to the `console.log` *not* to HTML.

    (Chrome Mac: View >> Developer >> JavaScript Console)
    
    (Chrome Windows: upper right corner menu -> More Tools -> Developer Tools or Ctrl + Shift + I)

You can now start the JSON NAPI process by executing from a terminal one of these lines:

on OS X

```
napi-wss-nymulator sampleJS
```

on Windows

```
napi-wss-net.ext sampleJS
```

If all is well the JSON NAPI process is running in this terminal window.

The `sampleJS` directory is the 'root' of a tiny webapp. If Chrome is your default browser, you can click on the link, otherwise you should open the URL in Chrome:

[https://127.0.0.1:11000](https://127.0.0.1:11000) _**Notice that that's an HTTPS not HTTP**_

And you're running the samples!

_**Do not forget that the JavaScript Console must be open in order to see anything happening!**_

In the `sampleJS` directory will be a few files:

1. a configuration called `config.json` that provides a configuration for the NAPI process (read the [wiki page](https://github.com/Nymi/JSON-API/wiki/How-the-API-Works) for details)
1. several log files will be created
1. a file called `provisions.json` that is the JSON NAPI's "database"
1. a directory called `static` which contains some static assets such as HTML and JavaScript

A few notes:

1. It is possible to have several napi-servers running simultaneously, but they must be running from different app-directories. To create an app directory just copy the play directory someplace (and remove the provisions.json file)
1. The directory layout is different in this release of NAPI, and things will change again in beta3.
1. We are using self-signed certs for SSL and we've included some in the release -- **do not** use these for real NEAs. Using self-signed certs means that you will be warned about security issues and will have to allow access to the page on first use. 

##Known Issues

1. In this release there is a server running the Nymi API communicating to a browser window using JSON over a secure websocket. The NEA is actually the JSON NAPI process combined with every browser window connected to it. This is somewhat counterintuitive and may lead to some confusion. It's possible to connect multiple browsers simultaneously to the napi server. This works, but should be thought of as a multiple window user interface to a single NEA. The samples make no attempt to do this "right". If you run two instances of provisioning sample you will almost certainly encounter unexpected behaviour. On the other hand, you can have as many windows running the watch, peek, and info sample apps as you wish, even concurrently with a *single* provisioning instance.

1. The napi-server may start using a lot of CPU (100% of one core). This is a bug. The service is still working so you might not notice this. If this happens you should restart the napi-server at your convenience.

1. On Windows, attempting to ctrl+c to kill napi-server-net.exe will cause it to hang. Instead, close the command prompt it was run from. Prepending `start` when initially running will make this less cumbersome.

