'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, Edit, Trash2, MoreVertical, Hourglass, Utensils, Search, X, Lightbulb, AlertTriangle } from 'lucide-react';
import { getUserPets, deleteUserPet } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';
import { chatStream } from '@/llm/chatStream';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
  padding: 2rem 1rem;
`;

const PetSwitcher = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PetAvatar = styled.div<{ $active?: boolean }>`
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #fed7aa, #fecaca);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: ${props => props.$active ? '3px solid #f97316' : '2px solid transparent'};
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.05);
    border-color: #f97316;
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .placeholder {
    font-size: 2rem;
  }
`;

const PetName = styled.div`
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
`;

const AddPetButton = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 2px dashed #d1d5db;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #9ca3af;
  
  &:hover {
    border-color: #f97316;
    color: #f97316;
    background: rgba(249, 115, 22, 0.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 10rem 0;
  
  .icon {
    color: #9ca3af;
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #6b7280;
  }
`;

const PetDetailCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 3px solid #1f2937;
  max-width: 60rem;
  margin: 0 auto;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  border-bottom: 1px solid #e5e7eb;
`;

const PetAvatar2 = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #fed7aa, #fecaca);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder {
    font-size: 2rem;
  }
`;

const PetTitleSection = styled.div`
  flex: 1;
  
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
`;

const MoreButtonWrapper = styled.div`
  position: relative;
`;

const MoreButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const DropdownMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 3rem;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: ${props => props.$show ? 'block' : 'none'};
  z-index: 10;
  min-width: 10rem;
`;

const MenuItem = styled.button<{ $variant?: 'blue' | 'red' }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  transition: background 0.2s;
  text-align: left;
  
  ${props => props.$variant === 'blue' ? `
    color: #3b82f6;
    
    &:hover {
      background: #eff6ff;
    }
  ` : `
    color: #ef4444;
    
    &:hover {
      background: #fef2f2;
    }
  `}
  
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const InfoCard = styled.div<{ $color?: string }>`
  background: ${props => {
    switch (props.$color) {
      case 'orange': return 'linear-gradient(135deg, #fed7aa, #fdba74)';
      case 'green': return 'linear-gradient(135deg, #a7f3d0, #6ee7b7)';
      default: return 'linear-gradient(135deg, #e0e7ff, #c7d2fe)';
    }
  }};
  padding: 1.5rem;
  border-radius: 1rem;
  
  .label {
    font-size: 0.875rem;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .value {
    font-size: 1.75rem;
    font-weight: bold;
    color: #1f2937;
  }
  
  .date {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: right;
    margin-top: 0.5rem;
  }
  
  .progress {
    width: 100%;
    height: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.25rem;
    margin-top: 0.5rem;
    overflow: hidden;
    
    .bar {
      height: 100%;
      background: ${props => {
        switch (props.$color) {
          case 'orange': return '#f97316';
          case 'green': return '#10b981';
          default: return '#3b82f6';
        }
      }};
      transition: width 0.3s;
    }
  }
  
  .sub-label {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const TagButton = styled.button<{ $variant?: 'default' | 'primary' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  ${props => props.$variant === 'primary' ? `
    background: white;
    color: #f97316;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #fff7ed;
    }
  ` : `
    background: white;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
    }
  `}
`;


const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .loading-text {
    font-size: 1.25rem;
    color: #ea580c;
  }
`;

const QuickActionsSection = styled.div`
  margin-top: 2rem;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;
`;

const QuickActionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .star {
    color: #1f2937;
  }
`;

const QuickActionsGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  
  &::-webkit-scrollbar {
    height: 0;
  }
`;

const QuickActionButton = styled.button<{ $bgColor?: string }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  .icon-wrapper {
    width: 4rem;
    height: 4rem;
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$bgColor || '#dbeafe'};
    font-size: 1.75rem;
  }
  
  .label {
    font-size: 0.875rem;
    color: #4b5563;
  }
`;

const DiscoverSection = styled.div`
  margin-top: 2rem;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;
`;

const DiscoverHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }
  
  .icon {
    color: #1f2937;
  }
`;

const DiscoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const DiscoverCard = styled.button<{ $bgColor?: string }>`
  position: relative;
  padding: 2rem 1.5rem;
  border-radius: 1.5rem;
  border: 3px solid #1f2937;
  background: ${props => props.$bgColor || '#dbeafe'};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .icon-wrapper {
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    border: 2px solid #1f2937;
  }
  
  .title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }
  
  .subtitle {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .action-button {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    background: #1f2937;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #374151;
    }
  }
`;

const ModalOverlay = styled.div`
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
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #fef7ed;
  border-radius: 24px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const ModalIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #8b7aff, #6b5bff);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #333;
  }
`;

const PetTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  margin-bottom: 24px;
`;

const PetTagIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ff9a85, #ff6b35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const PetTagText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ModalDescription = styled.p`
  color: #999;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 24px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b5bff;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  background: white;

  &::placeholder {
    color: #ccc;
  }

  &:focus {
    border-color: #6b5bff;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: 'primary' | 'secondary' }>`
  padding: 14px 32px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #8b7aff, #6b5bff);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #7a69ee, #5a4bee);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(107, 91, 255, 0.3);
    }
  ` : `
    background: transparent;
    color: #666;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  `}
`;

export default function MyPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<UserPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showDietModal, setShowDietModal] = useState(false);
  const [foodInput, setFoodInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryContentRef = useRef('');

  useEffect(() => {
    // 从本地存储获取用户ID
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.id);
      loadPets(userData.id);
    } else {
      router.push('/login');
    }
  }, [router]);
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const loadPets = async (uid: string) => {
    setLoading(true);
    const data = await getUserPets(uid, false);
    setPets(data);
    setLoading(false);
  };

  const handleDelete = async (petId: string) => {
    if (confirm('确定要删除这个宠物档案吗?此操作不可恢复!')) {
      const success = await deleteUserPet(petId);
      if (success && userId) {
        loadPets(userId);
      }
    }
  };

  const calculateAge = (birthDate?: string): { days: number; display: string } => {
    if (!birthDate) return { days: 0, display: '未知' };
    
    const birth = new Date(birthDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    let display = '';
    if (years === 0) {
      display = `${months}个月`;
    } else if (months < 0) {
      display = `${years - 1}岁${12 + months}个月`;
    } else {
      display = months === 0 ? `${years}岁` : `${years}岁${months}个月`;
    }
    
    return { days: diffDays, display };
  };
  
  const formatDate = (date?: string): string => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  // 生成饮食查询的系统提示词
  const generateDietPrompt = (petName: string, petBreed: string, foodName: string): string => {
    return `你是一个专业的宠物营养师和兽医。现在需要你分析以下情况：

宠物信息：
- 名字：${petName}
- 品种：${petBreed}

用户想知道这只宠物是否可以食用：${foodName}

请你以专业兽医的角度，提供简洁明了的分析。你的回答必须严格按照以下格式：

结论：[直接说明这只宠物是否建议食用该食物，用一句话表达]

理由：[详细说明原因，包括可能的健康影响、营养价值、潜在风险等]

注意：
1. 回答要简洁专业，不要过于冗长
2. 如果食物对宠物有害，一定要明确指出
3. 如果有任何疑虑，建议主人咨询线下兽医
4. 结论部分要明确（建议/不建议/适量可以等）
5. 不要包含其他无关内容，严格按照"结论："和"理由："的格式`;  };

  // 处理饮食查询
  const handleDietQuery = async () => {
    if (!foodInput.trim() || !selectedPet || isQuerying) return;

    setIsQuerying(true);
    setQueryResult('');
    queryContentRef.current = '';

    const prompt = generateDietPrompt(
      selectedPet.name,
      selectedPet.custom_breed || '狗狗',
      foodInput.trim()
    );

    const messages = [
      { role: 'system' as const, content: prompt },
      { role: 'user' as const, content: `请分析${selectedPet.name}是否可以吃${foodInput.trim()}` }
    ];

    await chatStream(
      messages,
      (chunk: string) => {
        queryContentRef.current += chunk;
      },
      () => {
        const finalContent = queryContentRef.current;
        if (finalContent) {
          setQueryResult(finalContent);
          setShowResult(true);
        }
        setIsQuerying(false);
        queryContentRef.current = '';
      },
      (error: Error) => {
        console.error('查询错误:', error);
        setQueryResult('查询失败，请稍后重试');
        setIsQuerying(false);
        queryContentRef.current = '';
      }
    );
  };

  // 关闭弹窗时重置状态
  const closeDietModal = () => {
    setShowDietModal(false);
    setShowResult(false);
    setFoodInput('');
    setQueryResult('');
    setIsQuerying(false);
  };
  
  const selectedPet = pets[selectedPetIndex];
  const ageInfo = selectedPet ? calculateAge(selectedPet.birth_date) : null;

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-text">加载中...</div>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <PetSwitcher>
        {pets.length === 0 ? (
          <AddPetButton onClick={() => router.push('/my-pets/add')}>
            <Plus size={24} />
          </AddPetButton>
        ) : (
          <>
            {pets.map((pet, index) => (
              <PetAvatar
                key={pet.id}
                $active={index === selectedPetIndex}
                onClick={() => setSelectedPetIndex(index)}
              >
                {(pet.avatar_url || pet.photo_url) ? (
                  <img src={pet.avatar_url || pet.photo_url} alt={pet.name} />
                ) : (
                  <div className="placeholder">🐾</div>
                )}
                <PetName>{pet.name}</PetName>
              </PetAvatar>
            ))}
            <AddPetButton onClick={() => router.push('/my-pets/add')}>
              <Plus size={24} />
            </AddPetButton>
          </>
        )}
      </PetSwitcher>

      {pets.length === 0 ? (
        <EmptyState>
          <div className="icon">
            <Hourglass size={64} />
          </div>
          <p>还没有宠物档案,点击上方按钮添加您的第一位毛孩子吧。</p>
        </EmptyState>
      ) : selectedPet && (
        <PetDetailCard>
          <CardHeader>
            <PetAvatar2>
              {(selectedPet.avatar_url || selectedPet.photo_url) ? (
                <img src={selectedPet.avatar_url || selectedPet.photo_url} alt={selectedPet.name} />
              ) : (
                <div className="placeholder">🐾</div>
              )}
            </PetAvatar2>
            <PetTitleSection>
              <h2>
                {selectedPet.name}
                {selectedPet.gender === 'male' && <span>♂️</span>}
                {selectedPet.gender === 'female' && <span>♀️</span>}
                {selectedPet.gender === 'unknown' && <span>❓</span>}
              </h2>
              <p>{selectedPet.custom_breed || '未知品种'}</p>
            </PetTitleSection>
            <MoreButtonWrapper ref={menuRef}>
              <MoreButton onClick={() => setShowMenu(!showMenu)}>
                <MoreVertical size={20} />
              </MoreButton>
              <DropdownMenu $show={showMenu}>
                <MenuItem $variant="blue" onClick={() => {
                  setShowMenu(false);
                  router.push(`/my-pets/${selectedPet.id}/edit`);
                }}>
                  <Edit size={16} />
                  编辑
                </MenuItem>
                <MenuItem $variant="red" onClick={() => {
                  setShowMenu(false);
                  handleDelete(selectedPet.id);
                }}>
                  <Trash2 size={16} />
                  删除
                </MenuItem>
              </DropdownMenu>
            </MoreButtonWrapper>
          </CardHeader>

          <CardBody>
            <InfoCard $color="orange">
              <div className="label">宠龄日</div>
              <div className="value">{ageInfo?.days || 0}天</div>
              <div className="progress">
                <div className="bar" style={{ width: '50%' }} />
              </div>
              <div className="sub-label">相当于人类 {ageInfo?.display || '未知'}</div>
              {selectedPet.birth_date && (
                <div className="date">{formatDate(selectedPet.birth_date)}</div>
              )}
            </InfoCard>

            <InfoCard $color="green">
              <div className="label">最近体重</div>
              <div className="value">{selectedPet.weight || 0}.00 {selectedPet.weight_unit || 'kg'}</div>
              <div className="progress">
                <div className="bar" style={{ width: '75%' }} />
              </div>
            </InfoCard>
          </CardBody>

          <CardFooter>
            <TagButton $variant="primary">⭐ 水晶盘</TagButton>
            {selectedPet.is_neutered ? (
              <TagButton>✅ 已绝育</TagButton>
            ) : (
              <TagButton>⚪ 未绝育</TagButton>
            )}
          </CardFooter>
        </PetDetailCard>
      )}
      
      {pets.length > 0 && selectedPet && (
        <>
          <QuickActionsSection>
            <QuickActionsHeader>
              <span className="star">★</span>
              <h3>快捷指令</h3>
            </QuickActionsHeader>
            <QuickActionsGrid>
              <QuickActionButton 
                $bgColor="#dbeafe"
                onClick={() => router.push('/medication')}
              >
                <div className="icon-wrapper">💙</div>
                <div className="label">用药</div>
              </QuickActionButton>
              
              <QuickActionButton 
                $bgColor="#fce7f3"
                onClick={() => router.push('/reminders')}
              >
                <div className="icon-wrapper">⏰</div>
                <div className="label">提醒</div>
              </QuickActionButton>
              
              <QuickActionButton 
                $bgColor="#fce7f3"
                onClick={() => setShowDietModal(true)}
              >
                <div className="icon-wrapper">🍴</div>
                <div className="label">饮食</div>
              </QuickActionButton>
            </QuickActionsGrid>
          </QuickActionsSection>
          
          <DiscoverSection>
            <DiscoverHeader>
              <span className="icon">📖</span>
              <h3>发现生活</h3>
            </DiscoverHeader>
            <DiscoverGrid>
              <DiscoverCard 
                $bgColor="#dbeafe"
                onClick={() => router.push('/animal-knowledge')}
              >
                <div className="icon-wrapper">📚</div>
                <div className="title">动物小知识</div>
                <div className="subtitle">每日精选</div>
                <div className="action-button">去看看 ›</div>
              </DiscoverCard>
              
              <DiscoverCard $bgColor="#fce7f3">
                <div className="icon-wrapper">💬</div>
                <div className="title">萌宠贴纸</div>
                <div className="subtitle">记录可爱瞬间</div>
                <div className="action-button">去装扮 ›</div>
              </DiscoverCard>
            </DiscoverGrid>
          </DiscoverSection>
        </>
      )}

      {showDietModal && selectedPet && (
        <ModalOverlay onClick={closeDietModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeDietModal}>
              <X size={20} />
            </CloseButton>
            
            {!showResult ? (
              // 查询界面
              <>
                <ModalHeader>
                  <ModalIconWrapper>
                    <Utensils size={24} />
                  </ModalIconWrapper>
                  <ModalTitle>智能饮食查询</ModalTitle>
                </ModalHeader>

                <PetTag>
                  <PetTagIcon>
                    {(selectedPet.avatar_url || selectedPet.photo_url) ? (
                      <img src={selectedPet.avatar_url || selectedPet.photo_url} alt={selectedPet.name} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <span>🐾</span>
                    )}
                  </PetTagIcon>
                  <PetTagText>{selectedPet.name} ({selectedPet.custom_breed || '狗狗'})</PetTagText>
                </PetTag>

                <ModalDescription>
                  输入想确认的食物，我们会以专业兽医视角提供是否适合这只宠物食用的建议。
                </ModalDescription>

                <InputLabel>食物名称</InputLabel>
                <InputWrapper>
                  <SearchIcon>
                    <Search size={20} />
                  </SearchIcon>
                  <Input
                    type="text"
                    placeholder="例如：苹果、巧克力"
                    value={foodInput}
                    onChange={(e) => setFoodInput(e.target.value)}
                    disabled={isQuerying}
                  />
                </InputWrapper>

                <ModalActions>
                  <Button variant="secondary" onClick={closeDietModal} disabled={isQuerying}>
                    取消
                  </Button>
                  <Button variant="primary" onClick={handleDietQuery} disabled={isQuerying || !foodInput.trim()}>
                    <Search size={18} />
                    {isQuerying ? '查询中...' : '立即查询'}
                  </Button>
                </ModalActions>
              </>
            ) : (
              // 结果界面
              <>
                <ModalHeader>
                  <ModalIconWrapper style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                    <Lightbulb size={24} />
                  </ModalIconWrapper>
                  <ModalTitle>智能分析结果</ModalTitle>
                </ModalHeader>

                <div style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '16px', 
                  border: '2px solid #f0f0f0',
                  marginBottom: '16px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  color: '#333'
                }}>
                  {queryResult}
                </div>

                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#991b1b', fontSize: '14px' }}>
                    仅供参考，若宠物有不适请尽快联系线下兽医。
                  </span>
                </div>

                <ModalActions>
                  <Button variant="primary" onClick={closeDietModal} style={{ marginLeft: 'auto' }}>
                    知道了
                  </Button>
                </ModalActions>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
