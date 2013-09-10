#include "windows.h"
#include <stdio.h>

#define g_szPipeName "\\\\.\\Pipe\\MyNamedPipe"
#define BUFFER_SIZE 1024 //1k
#define ACK_MESG_RECV "Message received successfully"

int main(int argc, char* argv[])
{
  HANDLE hPipe;
  while (true)
  {
    hPipe = CreateNamedPipe(g_szPipeName, PIPE_ACCESS_DUPLEX, PIPE_TYPE_MESSAGE | PIPE_READMODE_MESSAGE | PIPE_WAIT, PIPE_UNLIMITED_INSTANCES, BUFFER_SIZE, BUFFER_SIZE, NMPWAIT_USE_DEFAULT_WAIT, NULL);                   

    if (INVALID_HANDLE_VALUE == hPipe) 
    {
      printf("\nError occurred while creating the pipe: %d", GetLastError()); 
      return 1;
    }

    //Wait for the client to connect
    BOOL bClientConnected = ConnectNamedPipe(hPipe, NULL);

    if (FALSE == bClientConnected)
    {
      printf("\nError occurred while connecting to the client: %d", GetLastError()); 
      CloseHandle(hPipe);
      return 1;  //Error
    }

    char szBuffer[BUFFER_SIZE];
    DWORD cbBytes;
    BOOL bResult = ReadFile( hPipe, szBuffer, sizeof(szBuffer), &cbBytes, NULL);

    if ( (!bResult) || (0 == cbBytes)) 
    {
      printf("\nError occurred while reading from the client: %d", GetLastError()); 
      CloseHandle(hPipe);
      return 1;
    }

    printf("\nMessage: %s", szBuffer);
    CloseHandle(hPipe);
  }

  return 0;
}