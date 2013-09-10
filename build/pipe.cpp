#include "windows.h"
#include <stdio.h>

#define g_szPipeName "\\\\.\\Pipe\\MyNamedPipe"
#define BUFFER_SIZE 1024 //1k
#define ACK_MESG_RECV "Message received successfully"

int PipeMessage(const char* message)
{
  HANDLE hPipe;

  hPipe = CreateFile( g_szPipeName, GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL); 

  if (INVALID_HANDLE_VALUE == hPipe) 
  {
    printf("\nError occurred while connecting to the server: %d\n", GetLastError()); 
    //One might want to check whether the server pipe is busy
    //This sample will error out if the server pipe is busy
    //Read on ERROR_PIPE_BUSY and WaitNamedPipe() for that
    return 1;  //Error
  }

  char szBuffer[BUFFER_SIZE];
  DWORD cbBytes;

  strcpy_s(szBuffer, BUFFER_SIZE, message);

  BOOL bResult = WriteFile(hPipe, szBuffer, strlen(szBuffer)+1, &cbBytes, NULL); 

  if ( (!bResult) || (strlen(szBuffer)+1 != cbBytes))
  {
    printf("\nError occurred while writing to the server: %d\n", GetLastError()); 
    CloseHandle(hPipe);
    return 1;
  }

  CloseHandle(hPipe);
  return 0;
}