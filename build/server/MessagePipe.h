#include "windows.h"
#include "ConcurrentStack.h"
#include <string>

#define g_szPipeName "\\\\.\\Pipe\\MyNamedPipe"
#define BUFFER_SIZE 1024 //1k
#define ACK_MESG_RECV "Message received successfully"

typedef ConcurrentStack<std::string> MessageStack;
class MessagePipe
{
public:
  MessagePipe();
  int ReadMessage();
  ~MessagePipe();
  MessageStack& GetMessages() { return m_messageStack; }
  static DWORD WINAPI ThreadFunc(void* data);
  static MessagePipe& Instance();
  MessageStack FilteredStack(char code, int player);
private:
  MessageStack m_messageStack;
  HANDLE hPipe;
  char szBuffer[BUFFER_SIZE];
  DWORD cbBytes;
};