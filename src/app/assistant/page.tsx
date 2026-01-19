'use client';

import styled from 'styled-components';
import { chatStream } from '@/llm/chatStream';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: rgba(252, 253, 253, 1);
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '280px' : '0'};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const NewChatButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
`;

const HistoryList = styled.div`
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
`;

const HistoryItem = styled.div<{ $isActive: boolean }>`
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  background: ${props => props.$isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    background: rgba(102, 126, 234, 0.15);
  }
`;

const HistoryTitle = styled.div`
  font-size: 0.9rem;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

const DeleteButton = styled.button`
  padding: 0.25rem 0.5rem;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${HistoryItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: #f44336;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ToggleSidebarButton = styled.button`
  position: absolute;
  top: 1.5rem;
  left: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  z-index: 10;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea;
  margin: 0;
  text-align: center;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
`;

const MessageWrapper = styled.div<{ $isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  animation: slideIn 0.3s ease-out;
  position: relative;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageActions = styled.div<{ $isUser: boolean }>`
  position: absolute;
  ${props => props.$isUser ? 'right' : 'left'}: 0;
  bottom: -30px;
  display: flex;
  gap: 0.5rem;
  opacity: ${props => props.$isUser ? '0' : '1'};
  transition: opacity 0.2s ease;
  
  ${MessageWrapper}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: none;
  background:transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  // &:hover {
  //   background: rgba(102, 126, 234, 0.1);
  //   border-color: #667eea;
  //   transform: scale(1.1);
  // }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: ${props => props.$isUser ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem'};
  background: ${props => props.$isUser 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  word-wrap: break-word;
  line-height: 1.5;
  
  /* Markdown 样式 */
  p {
    margin: 0.5rem 0;
  }
  
  code {
    background: ${props => props.$isUser ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
  }
  
  pre {
    background: ${props => props.$isUser ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.25rem 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 1rem 0 0.5rem 0;
  }
`;

const RoleLabel = styled.div<{ $isUser: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.8)' : '#999'};
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const InputContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 2rem;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  
  // &:focus {
  //   border-color: #667eea;
  //   box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  // }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  margin-top: 3rem;
  
  h3 {
    color: #000;
    font-family: "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 22px;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #8C8C8C;
    font-family: "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    margin: 0;
  }
`;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export default function AssistantPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [copiedMessages, setCopiedMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef('');

  // 从 localStorage 加载历史记录
  useEffect(() => {
    const savedHistories = localStorage.getItem('chatHistories');
    if (savedHistories) {
      const parsed = JSON.parse(savedHistories);
      setChatHistories(parsed);
      if (parsed.length > 0) {
        const latestChat = parsed[0];
        setCurrentChatId(latestChat.id);
        setMessages(latestChat.messages);
      }
    } else {
      // 创建第一个对话
      const newChat: ChatHistory = {
        id: `${Date.now()}-${Math.random()}`,
        title: '新对话',
        messages: [],
        timestamp: Date.now()
      };
      setChatHistories([newChat]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    if (chatHistories.length > 0) {
      localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    }
  }, [chatHistories]);

  // 更新当前对话的消息
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      setChatHistories(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { 
                ...chat, 
                messages, 
                timestamp: Date.now(),
                title: messages[0]?.content?.substring(0, 30) || '新对话'
              }
            : chat
        )
      );
    }
  }, [messages, currentChatId]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // 创建新对话
  const createNewChat = () => {
    const newChat: ChatHistory = {
      id: `${Date.now()}-${Math.random()}`,
      title: '新对话',
      messages: [],
      timestamp: Date.now()
    };
    setChatHistories(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages([]);
  };

  // 切换对话
  const switchChat = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  // 删除对话
  const deleteChat = (chatId: string) => {
    setChatHistories(prev => {
      const newHistories = prev.filter(c => c.id !== chatId);
      
      if (currentChatId === chatId) {
        if (newHistories.length > 0) {
          setCurrentChatId(newHistories[0].id);
          setMessages(newHistories[0].messages);
        } else {
          // 如果删除后没有对话了，创建一个新对话
          const newChat: ChatHistory = {
            id: `${Date.now()}-${Math.random()}`,
            title: '新对话',
            messages: [],
            timestamp: Date.now()
          };
          setCurrentChatId(newChat.id);
          setMessages([]);
          return [newChat];
        }
      }
      
      return newHistories;
    });
  };

  const handleSend = async () => {
    if (message.trim() === '' || isLoading) return;
    
    setIsLoading(true);
    
    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: message,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // 清空输入框
    setMessage('');
    setStreamingMessage('');
    streamingContentRef.current = '';
    
    // 使用流式输出
    await chatStream(
      newMessages,
      // onChunk: 接收到新内容
      (chunk: string) => {
        streamingContentRef.current += chunk;
        setStreamingMessage(streamingContentRef.current);
      },
      // onComplete: 流式输出完成
      () => {
        const finalContent = streamingContentRef.current;
        console.log('Stream complete, final content:', finalContent);
        
        if (finalContent) {
          // 先添加消息到列表
          setMessages(prev => {
            const newList: Message[] = [...prev, { 
              role: 'assistant' as const, 
              content: finalContent 
            }];
            console.log('Updated messages:', newList);
            return newList;
          });
          
          // 使用 setTimeout 确保状态更新完成后再清空
          setTimeout(() => {
            setStreamingMessage('');
            streamingContentRef.current = '';
            setIsLoading(false);
          }, 0);
        } else {
          setStreamingMessage('');
          streamingContentRef.current = '';
          setIsLoading(false);
        }
      },
      // onError: 发生错误
      (error: Error) => {
        console.error('Chat error:', error);
        setStreamingMessage('');
        streamingContentRef.current = '';
        setIsLoading(false);
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 复制消息内容
  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    
    // 标记为已复制
    setCopiedMessages(prev => new Set(prev).add(index));
    
    // 2秒后恢复图标
    setTimeout(() => {
      setCopiedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 2000);
  };

  // 重新发送消息
  const handleRetry = async (content: string) => {
    if (isLoading) return;
    
    // 找到这条消息的索引
    const assistantIndex = messages.findIndex(
      msg => msg.role === 'assistant' && msg.content === content
    );
    
    if (assistantIndex === -1) return;
    
    // 删除这条消息及之后的所有消息
    const newMessages = messages.slice(0, assistantIndex);
    setMessages(newMessages);
    
    setIsLoading(true);
    setStreamingMessage('');
    streamingContentRef.current = '';
    
    // 重新请求
    await chatStream(
      newMessages,
      (chunk: string) => {
        streamingContentRef.current += chunk;
        setStreamingMessage(streamingContentRef.current);
      },
      () => {
        const finalContent = streamingContentRef.current;
        if (finalContent) {
          setMessages(prev => {
            const newList: Message[] = [...prev, { 
              role: 'assistant' as const, 
              content: finalContent 
            }];
            return newList;
          });
          
          setTimeout(() => {
            setStreamingMessage('');
            streamingContentRef.current = '';
            setIsLoading(false);
          }, 0);
        } else {
          setStreamingMessage('');
          streamingContentRef.current = '';
          setIsLoading(false);
        }
      },
      (error: Error) => {
        console.error('Chat error:', error);
        setStreamingMessage('');
        streamingContentRef.current = '';
        setIsLoading(false);
      }
    );
  };

  return (
    <Container>
      {/* 侧边栏 */}
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader>
          <NewChatButton onClick={createNewChat}>
            ✨ 新建对话
          </NewChatButton>
        </SidebarHeader>
        <HistoryList>
          {chatHistories.map(chat => (
            <HistoryItem 
              key={chat.id}
              $isActive={chat.id === currentChatId}
              onClick={() => switchChat(chat.id)}
            >
              <HistoryTitle>{chat.title}</HistoryTitle>
              <DeleteButton onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}>
                🗑️
              </DeleteButton>
            </HistoryItem>
          ))}
        </HistoryList>
      </Sidebar>

      {/* 主内容区 */}
      <MainContent>
        <ToggleSidebarButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '◀' : '▶'}
        </ToggleSidebarButton>
        
        <Header>
          <Title>🐾 智能宠物助手</Title>
        </Header>
      
      <MessagesContainer>
        {messages.length === 0 ? (
          <EmptyState>
            <h3>👋 你好!</h3>
            <p>我是智能宠物助手,可以为您提供宠物护理建议</p>
            <p>请问有什么可以帮您的吗?</p>
          </EmptyState>
        ) : (
          <>
            {messages.map((msg, index) => (
              <MessageWrapper key={index} $isUser={msg.role === 'user'}>
                <MessageBubble $isUser={msg.role === 'user'}>
                  <RoleLabel $isUser={msg.role === 'user'}>
                    {msg.role === 'user' ? '你' : '🤖 AI助手'}
                  </RoleLabel>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </MessageBubble>
                <MessageActions $isUser={msg.role === 'user'}>
                  <ActionButton 
                    onClick={() => handleCopy(msg.content, index)}
                    title="复制"
                  >
                    {copiedMessages.has(index) ? (
                      <img src="/images/chat/Check.svg" alt="已复制" width={12} height={12} />
                    ) : (
                      <img src="/images/chat/copyB.svg" alt="复制" width={18} height={18} />
                    )}
                  </ActionButton>
                  {msg.role === 'assistant' && (
                    <ActionButton 
                      onClick={() => handleRetry(msg.content)}
                      title="重新发送"
                    >
                      <img src="/images/chat/reloadB.svg" alt="重新发送" width={18} height={18} />
                    </ActionButton>
                  )}
                </MessageActions>
              </MessageWrapper>
            ))}
            
            {/* 流式输出中的消息 */}
            {streamingMessage && (
              <MessageWrapper $isUser={false}>
                <MessageBubble $isUser={false}>
                  <RoleLabel $isUser={false}>🤖 AI助手</RoleLabel>
                  <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                </MessageBubble>
              </MessageWrapper>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </MessagesContainer>
      
      <InputContainer>
        <InputWrapper>
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题..."
            disabled={isLoading}
          />
          <SendButton onClick={handleSend} disabled={isLoading}>
            {isLoading ? '发送中...' : '发送'}
          </SendButton>
        </InputWrapper>
      </InputContainer>
      </MainContent>
    </Container>
  );
}
