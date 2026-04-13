'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, ArrowLeft, ClipboardList, Calendar, ChevronDown, MoreVertical, Check, Trash2 } from 'lucide-react';
import { getUserPets } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';
import { REMINDER_TYPES, createReminder, getPendingReminders, getCompletedReminders, getReminderTypeByName, PetReminder, completeReminder, deleteReminder } from '@/lib/api/petReminders';

const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 96px;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const Header = styled.div`
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const AddButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const TabContainer = styled.div`
  background: rgba(245, 242, 233, 0.95);
  display: flex;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.$active ? '#782221' : '#5D4037'};
  border-bottom: ${props => props.$active ? '3px solid #782221' : '3px solid transparent'};
  transition: all 0.2s;
  font-weight: ${props => props.$active ? '700' : '400'};
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  
  &:hover {
    color: #782221;
  }
`;

const ContentContainer = styled.div`
  padding: 1rem;
  padding-bottom: 80px;
`;

const EmptyState = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 60rem;
  margin: 0 auto;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  
  .icon-wrapper {
    width: 5rem;
    height: 5rem;
    background: linear-gradient(135deg, #782221, #9B2C2C);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    border: 2px solid #2C2420;
    box-shadow: 3px 3px 0px 0px #2C2420;
    
    svg {
      color: #F5F2E9;
    }
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2C2420;
    margin-bottom: 0.5rem;
    font-family: var(--font-playfair), serif;
  }
  
  p {
    font-size: 0.875rem;
    color: #5D4037;
    font-family: var(--font-dm-sans), sans-serif;
  }
`;

const ModalOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(44, 36, 32, 0.6);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 2rem;
  max-width: 32rem;
  width: 100%;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  .icon {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #782221, #9B2C2C);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    border: 2px solid #2C2420;
    box-shadow: 2px 2px 0px 0px #2C2420;
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2C2420;
    margin: 0;
    font-family: var(--font-playfair), serif;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2C2420;
    margin-bottom: 0.5rem;
    font-family: var(--font-playfair), serif;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  transition: all 0.2s;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  
  &::placeholder {
    color: #aaa;
  }
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.div`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-family: var(--font-dm-sans), sans-serif;
  
  &:hover {
    border-color: #782221;
  }
  
  .icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.875rem;
    color: white;
  }
  
  .text {
    flex: 1;
    color: #2C2420;
  }
  
  svg {
    color: #5D4037;
    flex-shrink: 0;
  }
`;

const DropdownMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #F5F2E9;
  border: 3px solid #2C2420;
  border-radius: 0;
  max-height: 20rem;
  overflow-y: auto;
  z-index: 100;
  display: ${props => props.$show ? 'block' : 'none'};
  box-shadow: 4px 4px 0px 0px #2C2420;
  
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(44, 36, 32, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #5D4037;
  }
`;

const MenuItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(44, 36, 32, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(120, 34, 33, 0.05);
  }
  
  .icon {
    width: 2rem;
    height: 2rem;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
    color: white;
  }
  
  .text {
    flex: 1;
    color: #2C2420;
    font-size: 0.875rem;
  }
  
  .check {
    color: #782221;
    flex-shrink: 0;
    font-weight: 700;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 3rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #782221;
    pointer-events: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  min-height: 5rem;
  resize: vertical;
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.2s;
  color: #2C2420;
  
  &::placeholder {
    color: #aaa;
  }
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 0;
  border: 2px solid #2C2420;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  
  ${props => props.$variant === 'primary' ? `
    background: #782221;
    color: #F5F2E9;
    box-shadow: 3px 3px 0px 0px #2C2420;
    
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px 0px #2C2420;
    }
  ` : `
    background: transparent;
    color: #2C2420;
    
    &:hover {
      background: rgba(44, 36, 32, 0.05);
    }
  `}
`;

const ReminderCard = styled.div`
  background: #F5F2E9;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 0;
  border: 3px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  transition: all 0.3s;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px #2C2420;
  }
`;

const CardIcon = styled.div<{ $color?: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0;
  background: ${props => props.$color || 'linear-gradient(135deg, #782221, #9B2C2C)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.div<{ $completed?: boolean }>`
  font-weight: 700;
  font-size: 1rem;
  color: #2C2420;
  margin-bottom: 0.25rem;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  font-family: var(--font-playfair), serif;
`;

const CardMeta = styled.div`
  font-size: 0.875rem;
  color: #5D4037;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-family: var(--font-dm-sans), sans-serif;
`;

const CardNote = styled.div`
  font-size: 0.875rem;
  color: #5D4037;
  margin-top: 0.25rem;
  font-family: var(--font-dm-sans), sans-serif;
  font-style: italic;
`;

const MenuButton = styled.button`
  background: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0.5rem;
  color: #5D4037;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  flex-shrink: 0;
  
  &:hover {
    border-color: #2C2420;
    color: #2C2420;
  }
`;

const ActionMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  right: 1rem;
  top: 3.5rem;
  background: #F5F2E9;
  border: 3px solid #2C2420;
  border-radius: 0;
  overflow: hidden;
  z-index: 10;
  min-width: 10rem;
  display: ${props => props.$show ? 'block' : 'none'};
  box-shadow: 4px 4px 0px 0px #2C2420;
`;

const ActionMenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: #F5F2E9;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  color: ${props => props.$danger ? '#782221' : '#2C2420'};
  font-size: 0.875rem;
  font-family: var(--font-dm-sans), sans-serif;
  
  &:hover {
    background: ${props => props.$danger ? 'rgba(120, 34, 33, 0.1)' : 'rgba(44, 36, 32, 0.05)'};
  }
  
  &:not(:last-child) {
    border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  background: rgba(120, 34, 33, 0.1);
  color: #782221;
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(120, 34, 33, 0.3);
  font-family: var(--font-dm-sans), sans-serif;
`;

export default function RemindersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [currentPet, setCurrentPet] = useState<UserPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [pendingReminders, setPendingReminders] = useState<PetReminder[]>([]);
  const [completedReminders, setCompletedReminders] = useState<PetReminder[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '疫苗',
    date: '',
    note: ''
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      loadPets(userData.id);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const loadPets = async (uid: string) => {
    setLoading(true);
    const data = await getUserPets(uid, false);
    if (data.length > 0) {
      setCurrentPet(data[0]);
      await loadReminders(data[0].id);
    }
    setLoading(false);
  };

  const loadReminders = async (petId: string) => {
    const pending = await getPendingReminders(petId);
    const completed = await getCompletedReminders(petId);
    setPendingReminders(pending);
    setCompletedReminders(completed);
  };

  const handleComplete = async (reminderId: string) => {
    const success = await completeReminder(reminderId);
    if (success) {
      setOpenMenuId(null);
      if (currentPet) {
        await loadReminders(currentPet.id);
      }
    } else {
      alert('标记完成失败，请重试');
    }
  };

  const handleDelete = async (reminderId: string) => {
    if (confirm('确定要删除这个提醒吗？')) {
      const success = await deleteReminder(reminderId);
      if (success) {
        setOpenMenuId(null);
        if (currentPet) {
          await loadReminders(currentPet.id);
        }
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>加载中...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>{currentPet?.name || '宠物'} 的提醒事项</Title>
        </HeaderLeft>
        <AddButton onClick={() => setShowModal(true)}>
          <Plus size={24} />
        </AddButton>
      </Header>

      <TabContainer>
        <Tab 
          $active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        >
          待办
        </Tab>
        <Tab 
          $active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        >
          历史
        </Tab>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'pending' ? (
          pendingReminders.length > 0 ? (
            <div>
              {pendingReminders.map((reminder) => {
                const typeConfig = REMINDER_TYPES.find(t => t.type_code === reminder.reminder_type);
                return (
                  <ReminderCard key={reminder.id}>
                    <CardIcon $color={typeConfig?.color}>
                      {typeConfig?.icon}
                    </CardIcon>
                    <CardContent>
                      <CardTitle>{reminder.title}</CardTitle>
                      <CardMeta>
                        <Badge>{typeConfig?.type_name}</Badge>
                        <span>{reminder.scheduled_date}</span>
                        <Badge style={{ background: '#fef3c7', color: '#f59e0b' }}>日提醒</Badge>
                      </CardMeta>
                      {reminder.notes && (
                        <CardNote>{reminder.notes}</CardNote>
                      )}
                    </CardContent>
                    <MenuButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === reminder.id ? null : reminder.id);
                      }}
                    >
                      <MoreVertical size={20} />
                    </MenuButton>
                    <ActionMenu $show={openMenuId === reminder.id}>
                      <ActionMenuItem onClick={() => handleComplete(reminder.id)}>
                        <Check size={18} />
                        <span>标记完成</span>
                      </ActionMenuItem>
                      <ActionMenuItem $danger onClick={() => handleDelete(reminder.id)}>
                        <Trash2 size={18} />
                        <span>删除</span>
                      </ActionMenuItem>
                    </ActionMenu>
                  </ReminderCard>
                );
              })}
            </div>
          ) : (
            <EmptyState>
              <div className="icon-wrapper">
                <ClipboardList size={40} />
              </div>
              <h3>目前还没有待办记录</h3>
              <p>点击右上角 + 即可新增记录。</p>
            </EmptyState>
          )
        ) : (
          completedReminders.length > 0 ? (
            <div>
              {completedReminders.map((reminder) => {
                const typeConfig = REMINDER_TYPES.find(t => t.type_code === reminder.reminder_type);
                return (
                  <ReminderCard key={reminder.id} style={{ opacity: 0.6 }}>
                    <CardIcon $color={typeConfig?.color}>
                      {typeConfig?.icon}
                    </CardIcon>
                    <CardContent>
                      <CardTitle $completed>{reminder.title}</CardTitle>
                      <CardMeta>
                        <Badge>{typeConfig?.type_name}</Badge>
                        <span>{reminder.scheduled_date}</span>
                        {reminder.completed_at && (
                          <Badge style={{ background: '#fef3c7', color: '#f59e0b' }}>
                            {new Date(reminder.completed_at).toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Badge>
                        )}
                      </CardMeta>
                    </CardContent>
                    <MenuButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === reminder.id ? null : reminder.id);
                      }}
                    >
                      <MoreVertical size={20} />
                    </MenuButton>
                    <ActionMenu $show={openMenuId === reminder.id}>
                      <ActionMenuItem $danger onClick={() => handleDelete(reminder.id)}>
                        <Trash2 size={18} />
                        <span>删除</span>
                      </ActionMenuItem>
                    </ActionMenu>
                  </ReminderCard>
                );
              })}
            </div>
          ) : (
            <EmptyState>
              <div className="icon-wrapper">
                <ClipboardList size={40} />
              </div>
              <h3>目前还没有历史记录</h3>
              <p>完成的提醒会显示在这里。</p>
            </EmptyState>
          )
        )}
      </ContentContainer>
      
      <ModalOverlay $show={showModal} onClick={() => setShowModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div className="icon">📋</div>
            <h2>新增记录</h2>
          </ModalHeader>
          
          <FormGroup>
            <label>记录名称</label>
            <Input 
              placeholder="例如：狂犬病疫苗"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </FormGroup>
          
          <FormGroup>
            <label>类型</label>
            <SelectWrapper>
              <Select onClick={() => setShowTypeDropdown(!showTypeDropdown)}>
                <div 
                  className="icon" 
                  style={{ background: REMINDER_TYPES.find(t => t.type_name === formData.type)?.color }}
                >
                  {REMINDER_TYPES.find(t => t.type_name === formData.type)?.icon}
                </div>
                <div className="text">{formData.type}</div>
                <ChevronDown size={20} />
              </Select>
              <DropdownMenu $show={showTypeDropdown}>
                {REMINDER_TYPES.map((type) => (
                  <MenuItem
                    key={type.type_code}
                    $selected={formData.type === type.type_name}
                    onClick={() => {
                      setFormData({...formData, type: type.type_name});
                      setShowTypeDropdown(false);
                    }}
                  >
                    <div className="icon" style={{ background: type.color }}>
                      {type.icon}
                    </div>
                    <div className="text">{type.type_name}</div>
                    {formData.type === type.type_name && (
                      <div className="check">✓</div>
                    )}
                  </MenuItem>
                ))}
              </DropdownMenu>
            </SelectWrapper>
          </FormGroup>
          
          <FormGroup>
            <label>计划日期</label>
            <DateInputWrapper>
              <Calendar size={20} />
              <DateInput 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </DateInputWrapper>
          </FormGroup>
          
          <FormGroup>
            <label>备注（可选）</label>
            <TextArea 
              placeholder="预约医院、注意事项等"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
            />
          </FormGroup>
          
          <ModalActions>
            <Button $variant="secondary" onClick={() => setShowModal(false)}>
              取消
            </Button>
            <Button $variant="primary" onClick={async () => {
              if (!formData.name || !formData.date || !currentPet) {
                alert('请填写记录名称和计划日期');
                return;
              }
              
              const typeCode = getReminderTypeByName(formData.type);
              if (!typeCode) {
                alert('无效的提醒类型');
                return;
              }
              
              const result = await createReminder({
                pet_id: currentPet.id,
                title: formData.name,
                reminder_type: typeCode as any,
                scheduled_date: formData.date,
                notes: formData.note || undefined
              });
              
              if (result) {
                alert('提醒创建成功！');
                setShowModal(false);
                setFormData({ name: '', type: '疫苗', date: '', note: '' });
                // 重新加载提醒列表
                if (currentPet) {
                  await loadReminders(currentPet.id);
                }
              } else {
                alert('创建失败，请重试');
              }
            }}>
              保存
            </Button>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
}
