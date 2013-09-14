#include "MessagePipe.h"
#include <stdio.h>

MessagePipe::MessagePipe()
{
  hPipe = CreateNamedPipe(g_szPipeName, PIPE_ACCESS_DUPLEX, PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT, PIPE_UNLIMITED_INSTANCES, BUFFER_SIZE, BUFFER_SIZE, NMPWAIT_USE_DEFAULT_WAIT, NULL);                   
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
