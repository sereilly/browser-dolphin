#include "MessagePipe.h"
#include <stdio.h>
#define g_szPipeName "\\\\.\\Pipe\\MyNamedPipe"
MessagePipe::MessagePipe()
{
  hPipe = CreateNamedPipeA(g_szPipeName, PIPE_ACCESS_DUPLEX, PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT, PIPE_UNLIMITED_INSTANCES, BUFFER_SIZE, BUFFER_SIZE, NMPWAIT_USE_DEFAULT_WAIT, NULL);                   
  if (INVALID_HANDLE_VALUE == hPipe) 
  {
    printf("\nError occurred while creating the pipe: %d", GetLastError()); 
  }
}

int MessagePipe::ReadMessage()
{
  BOOL bClientConnected = ConnectNamedPipe(hPipe, NULL);

  if (FALSE == bClientConnected)
  {
    printf("\nError occurred while connecting to the client: %d", GetLastError()); 
    CloseHandle(hPipe);
    return 1;  //Error
  }

  BOOL bResult = ReadFile( hPipe, szBuffer, sizeof(szBuffer), &cbBytes, NULL);

  if ( (!bResult) || (0 == cbBytes)) 
  {
    printf("\nError occurred while reading from the client: %d", GetLastError()); 
    CloseHandle(hPipe);
    return 1;
  }
  m_messageStack.Push(std::string(szBuffer));
  DisconnectNamedPipe(hPipe);
  return 0;
}

MessagePipe::~MessagePipe()
{
  CloseHandle(hPipe);
}

DWORD WINAPI MessagePipe::ThreadFunc(void* data) {
  MessagePipe& pipe = *reinterpret_cast<MessagePipe*>(data);
  while (pipe.ReadMessage() == 0);
  return 0;
}

MessagePipe& MessagePipe::Instance()
{
  static bool initialized;
  static MessagePipe pipe;
  if (!initialized)
  {
    CreateThread(NULL, 0, MessagePipe::ThreadFunc, &pipe, 0, NULL);
    initialized = true;
  }
  return pipe;
}
