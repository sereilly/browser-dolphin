#define BUILDING_NODE_EXTENSION
#include <node.h>
#include <iostream>
#include <v8.h>
#include "pipe.h"
#include <string>

using namespace v8;

Handle<Value> Add(const Arguments& args) {
  HandleScope scope;

  if (args.Length() != 1) {
    ThrowException(Exception::TypeError(String::New("Wrong number of arguments")));
    return scope.Close(Undefined());
  }

  if (!args[0]->IsString()) {
    ThrowException(Exception::TypeError(String::New("Argument is not a string")));
    return scope.Close(Undefined());
  }

  std::string message = *String::AsciiValue(args[0]);
  PipeMessage(message.c_str());
  return scope.Close(args[0]->ToString());
}

void Init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("SendMessage"),
      FunctionTemplate::New(Add)->GetFunction());
}

NODE_MODULE(addon, Init)
