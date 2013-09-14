#include "MessagePipe.h"
#include <iostream>

DWORD WINAPI ThreadFunc(void* data) {
  MessagePipe& pipe = *reinterpret_cast<MessagePipe*>(data);
  while (pipe.ReadMessage() == 0);
  return 0;
}

int main(int argc, char* argv[])
{
  MessagePipe pipe;
  CreateThread(NULL, 0, ThreadFunc, &pipe, 0, NULL);
  
  while (true)
  {
    MessageStack& messageStack = pipe.GetMessages();
    while (!messageStack.IsEmpty())
    {
      std::cout << messageStack.Pop() << std::endl;
    }
  }
  return 0;
}