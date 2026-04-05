'use client';

import styled from 'styled-components';
import { chatStream } from '@/llm/chatStream';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getUserPets } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// 生成系统提示词 - 约束AI只回答宠物相关的问题,并包含宠物信息
const generateSystemPrompt = (selectedPet?: UserPet | null): string => {
  let prompt = `你是一个专业的宠物护理助手。你的职责是为用户提供关于宠物饲养、健康、行为、训练等方面的专业建议和帮助。\n\n`;
  
  // 如果有选中的宠物,添加宠物信息到系统提示词
  if (selectedPet) {
    prompt += `当前用户关注的宠物信息:\n`;
    prompt += `- 名字: ${selectedPet.name}\n`;
    if (selectedPet.custom_breed) {
      prompt += `- 品种: ${selectedPet.custom_breed}\n`;
    }
    if (selectedPet.gender) {
      const genderText = selectedPet.gender === 'male' ? '公' : selectedPet.gender === 'female' ? '母' : '未知';
      prompt += `- 性别: ${genderText}\n`;
    }
    if (selectedPet.birth_date) {
      prompt += `- 出生日期: ${selectedPet.birth_date}\n`;
    }
    if (selectedPet.weight) {
      prompt += `- 体重: ${selectedPet.weight}${selectedPet.weight_unit || 'kg'}\n`;
    }
    if (selectedPet.is_neutered !== undefined) {
      prompt += `- 绝育状态: ${selectedPet.is_neutered ? '已绝育' : '未绝育'}\n`;
    }
    if (selectedPet.notes) {
      try {
        const notes = JSON.parse(selectedPet.notes);
        if (notes.category) {
          const categoryText = notes.category === 'dog' ? '狗狗' : notes.category === 'cat' ? '猫咪' : notes.category;
          prompt += `- 宠物类型: ${categoryText}\n`;
        }
      } catch (e) {
        // 忽略JSON解析错误
      }
    }
    prompt += `\n请根据以上宠物的具体信息来回答用户的问题,提供针对性的建议。\n\n`;
  }
  
  prompt += `请遵守以下规则:\n`;
  prompt += `1. 只回答与宠物相关的问题(包括但不限于:宠物饲养、健康护理、行为训练、营养饮食、常见疾病等)\n`;
  prompt += `2. 如果用户询问与宠物无关的问题,请礼貌地提醒用户你只能回答宠物相关的问题\n`;
  prompt += `3. 提供专业、准确、实用的建议\n`;
  prompt += `4. 如果涉及严重的宠物健康问题,请建议用户咨询专业兽医\n`;
  prompt += `5. 保持友好、耐心的态度\n\n`;
  prompt += `现在请开始为用户提供帮助。`;
  
  return prompt;
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  font-family: var(--font-dm-sans), sans-serif;

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

const Header = styled.div`
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 4px rgba(44, 36, 32, 0.1);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #782221;
  margin: 0;
  text-align: center;
  font-family: var(--font-playfair), serif;
`;

const PetSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(120, 34, 33, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0;
  border: 1px solid rgba(120, 34, 33, 0.2);
`;

const PetIcon = styled.div`
  font-size: 1.2rem;
`;

const PetSelect = styled.select`
  background: transparent;
  border: none;
  color: #782221;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  padding: 0.25rem 0.5rem;
  font-family: var(--font-cinzel), serif;

  option {
    background: #F5F2E9;
    color: #2C2420;
  }
`;

const DeleteChatButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(244, 67, 54, 0.1);
    border-color: #f44336;
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogBox = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const DialogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const DialogIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const DialogTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  margin: 0;
`;

const DialogContent = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const DialogButton = styled.button<{ $variant?: 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${props => props.$variant === 'danger' ? 'none' : '1px solid #e5e7eb'};
  background: ${props => props.$variant === 'danger' ? '#f44336' : 'white'};
  color: ${props => props.$variant === 'danger' ? 'white' : '#333'};
  
  &:hover {
    background: ${props => props.$variant === 'danger' ? '#d32f2f' : '#f5f5f5'};
  }
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
  border-radius: 0;
  background: ${props => props.$isUser
    ? '#782221'
    : 'rgba(255, 255, 255, 0.95)'};
  color: ${props => props.$isUser ? '#F5F2E9' : '#2C2420'};
  box-shadow: 4px 4px 0px 0px #2C2420;
  border: 2px solid #2C2420;
  word-wrap: break-word;
  line-height: 1.5;
  font-family: var(--font-dm-sans), sans-serif;

  /* Markdown 样式 */
  p {
    margin: 0.5rem 0;
  }

  code {
    background: ${props => props.$isUser ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
    padding: 0.2rem 0.4rem;
    border-radius: 0;
    font-family: 'Courier New', monospace;
    border: 1px solid ${props => props.$isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
  }

  pre {
    background: ${props => props.$isUser ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
    padding: 1rem;
    border-radius: 0;
    overflow-x: auto;
    border: 1px solid ${props => props.$isUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};

    code {
      background: none;
      padding: 0;
      border: none;
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
    font-family: var(--font-playfair), serif;
  }
`;

const RoleLabel = styled.div<{ $isUser: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isUser ? 'rgba(255, 255, 255, 0.8)' : '#999'};
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const InputContainer = styled.div`
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  box-shadow: 0 -2px 4px rgba(44, 36, 32, 0.1);
  border-top: 2px solid rgba(44, 36, 32, 0.1);
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
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: white;
  font-family: var(--font-dm-sans), sans-serif;

  &:focus {
    border-color: #782221;
    box-shadow: 4px 4px 0px 0px rgba(120, 34, 33, 0.2);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  padding: 1rem 2rem;
  background: #782221;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 4px 4px 0px 0px #2C2420;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px #2C2420;
    background: #9B2C2C;
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px 0px #2C2420;
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

const QuickQuestionsContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1.5rem;
  border: 2px solid #000;
  box-shadow: 4px 4px 0px #000;
`;

const QuickQuestionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const QuickQuestionsIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: #000;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const QuickQuestionsTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #000;
  margin: 0;
`;

const QuickQuestionsSubtitle = styled.p`
  color: #8C8C8C;
  font-size: 0.9rem;
  margin: 0.5rem 0 1.5rem 4rem;
  text-align: left;
`;

const QuickQuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QuickQuestionButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  background: white;
  border: 2px solid #000;
  border-radius: 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
    box-shadow: 4px 4px 0px #000;
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 2px 2px 0px #000;
  }
`;


interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface QuickQuestion {
  question: string;
  count: number;
}


export default function AssistantPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [copiedMessages, setCopiedMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingContentRef = useRef('');
  
  // 宠物相关状态
  const [pets, setPets] = useState<UserPet[]>([]);
  const [selectedPet, setSelectedPet] = useState<UserPet | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 快捷提问数据
  const quickQuestions: QuickQuestion[] = [
    { question: '它一天吃多少东西比较合适?', count: 14 },
    { question: '它最近有点拉肚子为什么?', count: 11 },
    { question: '它体重标准吗?', count: 1 },
    { question: '它疫苗多久打一次?', count: 1 },
    { question: '它驱虫多久做一次合适?', count: 0 },
  ];

  // 加载用户的宠物列表
  useEffect(() => {
    const loadPets = async () => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        const petList = await getUserPets(userData.id);
        setPets(petList);
        // 默认选中第一个宠物
        if (petList.length > 0) {
          setSelectedPet(petList[0]);
          // 加载该宠物的历史对话
          loadPetMessages(petList[0].id);
        }
      }
    };
    loadPets();
  }, []);

  // 当切换宠物时,加载该宠物的历史对话
  useEffect(() => {
    if (selectedPet) {
      loadPetMessages(selectedPet.id);
    }
  }, [selectedPet?.id]);

  // 从 localStorage 加载指定宠物的对话历史
  const loadPetMessages = (petId: string) => {
    const saved = localStorage.getItem(`pet_chat_${petId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      } catch (e) {
        console.error('加载对话历史失败:', e);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };

  // 保存对话历史到 localStorage
  const savePetMessages = (petId: string, msgs: Message[]) => {
    try {
      localStorage.setItem(`pet_chat_${petId}`, JSON.stringify(msgs));
    } catch (e) {
      console.error('保存对话历史失败:', e);
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

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
    // 保存用户消息到 localStorage
    if (selectedPet) {
      savePetMessages(selectedPet.id, newMessages);
    }
    
    // 清空输入框
    setMessage('');
    setStreamingMessage('');
    streamingContentRef.current = '';
    
    // 构造包含系统提示词的消息数组(系统提示词不保存到状态中,只在发送时添加)
    const messagesWithSystem: Message[] = [
      { role: 'system', content: generateSystemPrompt(selectedPet) },
      ...newMessages
    ];
    
    // 使用流式输出
    await chatStream(
      messagesWithSystem,
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
            // 保存到 localStorage
            if (selectedPet) {
              savePetMessages(selectedPet.id, newList);
            }
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
    
    // 构造包含系统提示词的消息数组
    const messagesWithSystem: Message[] = [
      { role: 'system', content: generateSystemPrompt(selectedPet) },
      ...newMessages
    ];
    
    // 重新请求
    await chatStream(
      messagesWithSystem,
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
            // 保存到 localStorage
            if (selectedPet) {
              savePetMessages(selectedPet.id, newList);
            }
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

  // 删除当前宠物的对话记录
  const handleDeleteChat = () => {
    if (selectedPet) {
      // 从 localStorage 删除
      localStorage.removeItem(`pet_chat_${selectedPet.id}`);
      // 清空当前消息
      setMessages([]);
      // 关闭对话框
      setShowDeleteDialog(false);
    }
  };

  // 点击快捷提问
  const handleQuickQuestion = async (question: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: question,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    // 保存用户消息到 localStorage
    if (selectedPet) {
      savePetMessages(selectedPet.id, newMessages);
    }
    
    // 清空输入框
    setMessage('');
    setStreamingMessage('');
    streamingContentRef.current = '';
    
    // 构造包含系统提示词的消息数组
    const messagesWithSystem: Message[] = [
      { role: 'system', content: generateSystemPrompt(selectedPet) },
      ...newMessages
    ];
    
    // 使用流式输出
    await chatStream(
      messagesWithSystem,
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
            // 保存到 localStorage
            if (selectedPet) {
              savePetMessages(selectedPet.id, newList);
            }
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

  return (
    <Container>
      <MainContent>
        <Header>
          {messages.length > 0 && (
            <DeleteChatButton onClick={() => setShowDeleteDialog(true)}>
              🗑️
            </DeleteChatButton>
          )}
          <HeaderContent>
            <Title>🐾 智能宠物助手</Title>
            {pets.length > 0 && (
              <PetSelector>
                <PetIcon>🐾</PetIcon>
                <PetSelect 
                  value={selectedPet?.id || ''} 
                  onChange={(e) => {
                    const pet = pets.find(p => p.id === e.target.value);
                    setSelectedPet(pet || null);
                  }}
                >
                  {pets.map(pet => {
                    // 从notes中解析宠物类型
                    let petType = '🐾';
                    try {
                      const notes = JSON.parse(pet.notes || '{}');
                      if (notes.category === 'dog') petType = '🐕';
                      else if (notes.category === 'cat') petType = '🐱';
                    } catch (e) {}
                    
                    return (
                      <option key={pet.id} value={pet.id}>
                        {petType} {pet.name} {pet.custom_breed ? `(${pet.custom_breed})` : ''}
                      </option>
                    );
                  })}
                </PetSelect>
              </PetSelector>
            )}
          </HeaderContent>
        </Header>
      
      <MessagesContainer>
        {messages.length === 0 ? (
          <>
            <EmptyState>
              <h3>👋 你好!</h3>
              <p>我是智能宠物助手,可以为您提供宠物护理建议</p>
              <p>请问有什么可以帮您的吗?</p>
            </EmptyState>
            
            <QuickQuestionsContainer>
              <QuickQuestionsHeader>
                <QuickQuestionsIcon>⚡</QuickQuestionsIcon>
                <QuickQuestionsTitle>快捷提问</QuickQuestionsTitle>
              </QuickQuestionsHeader>
              <QuickQuestionsSubtitle>大家都在问这些问题 👋</QuickQuestionsSubtitle>
              
              <QuickQuestionsList>
                {quickQuestions.map((item, index) => (
                  <QuickQuestionButton 
                    key={index}
                    onClick={() => handleQuickQuestion(item.question)}
                  >
                    {item.question}
                  </QuickQuestionButton>
                ))}
              </QuickQuestionsList>
            </QuickQuestionsContainer>
          </>
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

      {/* 删除确认对话框 */}
      {showDeleteDialog && (
        <ConfirmDialog onClick={() => setShowDeleteDialog(false)}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogIcon>🗑️</DialogIcon>
              <DialogTitle>清除该宠物的问诊记录?</DialogTitle>
            </DialogHeader>
            <DialogContent>
              确认后，该宠物当前的聊天记录将被清空。
            </DialogContent>
            <DialogActions>
              <DialogButton onClick={() => setShowDeleteDialog(false)}>
                取消
              </DialogButton>
              <DialogButton $variant="danger" onClick={handleDeleteChat}>
                清除
              </DialogButton>
            </DialogActions>
          </DialogBox>
        </ConfirmDialog>
      )}
    </Container>
  );
}
