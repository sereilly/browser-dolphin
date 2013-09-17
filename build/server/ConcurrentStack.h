// Sean Reilly
#pragma once
#include <stack>
#include <Windows.h>

template<typename T>
class ConcurrentStack
{
public:
  ConcurrentStack()
  {
    memset(&m_sec, 0, sizeof(CRITICAL_SECTION));
    InitializeCriticalSection(&m_sec);
  }

  ~ConcurrentStack()
  {
    DeleteCriticalSection(&m_sec);
  }
    
  void Push(const T& val)
  {
    Lock();
    m_stack.push(val);
    Unlock();
  }

  T Pop()
  {
    Lock();
    T val = m_stack.top();
    m_stack.pop();
    Unlock();
    return val;
  }

  size_t Size()
  {
    Lock();
    uint size = m_stack.size();
    Unlock();
    return size;
  }

  bool IsEmpty()
  {
    Lock();
    bool isEmpty = m_stack.empty();
    Unlock();
    return isEmpty;
  }

private:
  std::stack<T> m_stack;
  CRITICAL_SECTION m_sec;

  inline void Lock() const
  {
    EnterCriticalSection(const_cast<CRITICAL_SECTION*>(&m_sec));
  }
  inline void Unlock() const
  {
    LeaveCriticalSection(const_cast<CRITICAL_SECTION*>(&m_sec));
  }
};
