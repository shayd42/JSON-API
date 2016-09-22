#pragma once
#ifndef JSON_NAPI
#define JSON_NAPI

//#define API __attribute__((visibility("default")))
#define API

#ifdef __cplusplus

#include <atomic>
#include <string>
#include <sstream>
//#include <src/api/command.h>
//#include <src/api/enums.h>

typedef long long int milliseconds;

template< typename DataType >
  std::wostream& add_the_w( std::wostream& out, const DataType data ){
    std::stringstream subout;
    subout << data;
    return out << subout.str().c_str();
  }

namespace nymi{

  enum API class LogLevel{
      normal,
      info,
      debug,
      verbose
  };
  API std::ostream& operator<<( std::ostream& out, const LogLevel v );
  API inline std::wostream& operator<<( std::wostream& out, const LogLevel data ){ return add_the_w< LogLevel >( out, data ); }

  enum API class ConfigOutcome{
      okay,
      failedToInit,
      configurationFileNotFound,
      configurationFileNotReadable,
      configurationFileNotParsed
  };
  API std::ostream& operator<<( std::ostream& out, const ConfigOutcome v );

  API inline std::wostream& operator<<( std::wostream& out, const ConfigOutcome data ){ return add_the_w< ConfigOutcome >( out, data ); }

  enum API class JsonGetOutcome{
      okay,
      napiNotRunning,
      timedout,
      quitSignaled,
      napiFinished
  };
  API std::ostream& operator<<( std::ostream& out, const JsonGetOutcome v );

  API inline std::wostream& operator<<( std::wostream& out, const JsonGetOutcome data ){ return add_the_w< JsonGetOutcome >( out, data ); }

  enum API class JsonPutOutcome{
      okay,
      napiNotRunning
  };
  API std::ostream& operator<<( std::ostream& out, const JsonPutOutcome v );

  API inline std::wostream& operator<<( std::wostream& out, const JsonPutOutcome data ){ return add_the_w< JsonPutOutcome >( out, data ); }

  API ConfigOutcome jsonNapiConfigure( std::string rootDirectory, LogLevel logLevel = LogLevel::normal, int port = -1, std::string host = "" );
  API JsonPutOutcome jsonNapiPut( std::string json_in );
  API JsonGetOutcome jsonNapiGet( std::string& json );
  API JsonGetOutcome jsonNapiGet( std::string& json, milliseconds timeout, milliseconds sleep = 100 );
  API JsonGetOutcome jsonNapiGet( std::string& json, std::atomic< bool >& quit, long long int sleep = 100 );
  API void jsonNapiFinish();
  API void jsonNapiTerminate();
}

extern "C" {

#endif // __cplusplus

typedef enum{
    NAPI_DL_NORMAL,
    NAPI_DL_INFO,
    NAPI_DL_DEBUG,
    NAPI_DL_VEBOSE
}                     logLevel;

typedef enum{
    NAPI_CO_OKAY,
    NAPI_CO_FAILED_TO_INIT,
    NAPI_CO_CONFIGURATION_FILE_NOT_FOUND,
    NAPI_CO_CONFIGURATION_FILE_NOT_READABLE,
    NAPI_CO_CONFIGURATION_FILE_NOT_PARSED,
    NAPI_CO_IMPOSSIBLE
}                     configOutcome;
typedef enum{
    NAPI_PO_OKAY,
    NAPI_PO_NAPI_NOT_RUNNING,
    NAPI_PO_IMPOSSIBLE
}                     jsonPutOutcome;
typedef enum{
    NAPI_GO_OKAY,
    NAPI_GO_NAPI_NOT_RUNNING,
    NAPI_GO_TIMED_OUT,
    NAPI_GO_QUIT_SIGNALED,
    NAPI_GO_NAPI_FINISHED,
    NAPI_GO_IMPOSSIBLE
}                     jsonGetOutcome;

extern configOutcome jsonNapiConfigure( const char* rootDirectory, logLevel logLevel, int port, const char* host );
extern jsonPutOutcome jsonNapiPut( const char* json_in );
extern jsonGetOutcome jsonNapiGet( char* json_out, unsigned long long max );
extern jsonGetOutcome jsonNapiGetTimeout( char* json_out, unsigned long long max, long long int timeout, long long int sleep );
extern void jsonNapiFinish();
extern void jsonNapiTerminate();

#ifdef __cplusplus
}

#endif // __cplusplus
#endif // JSON_NAPI
