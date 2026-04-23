'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, Edit, Trash2, MoreVertical, Hourglass, Utensils, Search, X, Lightbulb, AlertTriangle } from 'lucide-react';
import { getUserPets, deleteUserPet } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';
import { chatNonStream } from '@/llm/chatStream';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  padding: 120px 2rem 2rem;
  font-family: var(--font-dm-sans), sans-serif;
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
  background: linear-gradient(135deg, #C5A059, #782221);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: ${props => props.$active ? '3px solid #782221' : '2px solid rgba(44, 36, 32, 0.2)'};
  transition: all 0.3s;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(120, 34, 33, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: scale(1.05);
    border-color: #782221;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    filter: sepia(0.2) contrast(1.05);
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
  background: #2C2420;
  color: #F5F2E9;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  white-space: nowrap;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 600;
`;

const AddPetButton = styled.button`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  border: 2px dashed #5D4037;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #5D4037;

  &:hover {
    border-color: #782221;
    color: #782221;
    background: rgba(120, 34, 33, 0.05);
    transform: scale(1.05);
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
  background: #F5F2E9;
  border-radius: 0;
  padding: 0;
  box-shadow: 8px 8px 0px 0px #2C2420;
  border: 3px solid #2C2420;
  max-width: 60rem;
  margin: 0 auto;
  transition: all 0.3s;

  &:hover {
    box-shadow: 12px 12px 0px 0px #2C2420;
    transform: translate(-2px, -2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  background: rgba(255, 255, 255, 0.5);
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
    font-weight: 700;
    color: #2C2420;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-playfair), serif;
  }

  p {
    font-size: 0.875rem;
    color: #5D4037;
    margin-top: 0.25rem;
    font-family: var(--font-cinzel), serif;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

const MoreButtonWrapper = styled.div`
  position: relative;
`;

const MoreButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0;
  border: 2px solid #2C2420;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #2C2420;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const DropdownMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 3rem;
  right: 0;
  background: #F5F2E9;
  border-radius: 0;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  overflow: hidden;
  display: ${props => props.$show ? 'block' : 'none'};
  z-index: 10;
  min-width: 10rem;
`;

const MenuItem = styled.button<{ $variant?: 'blue' | 'red' }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: #F5F2E9;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  transition: all 0.3s;
  text-align: left;
  font-family: var(--font-dm-sans), sans-serif;
  font-weight: 600;
  
  ${props => props.$variant === 'blue' ? `
    color: #2C2420;
    
    &:hover {
      background: rgba(120, 34, 33, 0.08);
      color: #782221;
    }
  ` : `
    color: #782221;
    
    &:hover {
      background: rgba(120, 34, 33, 0.12);
    }
  `}
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(44, 36, 32, 0.15);
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
      case 'orange': return 'linear-gradient(135deg, #C5A059, #D4AF37)';
      case 'green': return 'linear-gradient(135deg, #556B2F, #6B8E23)';
      default: return 'linear-gradient(135deg, #9B2C2C, #782221)';
    }
  }};
  padding: 1.5rem;
  border-radius: 0;
  border: 2px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px #2C2420;
  }

  .label {
    font-size: 0.875rem;
    color: #F5F2E9;
    margin-bottom: 0.5rem;
    font-family: var(--font-cinzel), serif;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #F5F2E9;
    font-family: var(--font-playfair), serif;
  }

  .date {
    font-size: 0.75rem;
    color: rgba(245, 242, 233, 0.8);
    text-align: right;
    margin-top: 0.5rem;
  }

  .progress {
    width: 100%;
    height: 0.5rem;
    background: rgba(245, 242, 233, 0.3);
    border-radius: 0;
    margin-top: 0.5rem;
    overflow: hidden;
    border: 1px solid rgba(44, 36, 32, 0.2);

    .bar {
      height: 100%;
      background: #F5F2E9;
      transition: width 0.3s;
    }
  }

  .sub-label {
    font-size: 0.75rem;
    color: rgba(245, 242, 233, 0.9);
    margin-top: 0.25rem;
  }
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 2px solid rgba(44, 36, 32, 0.1);
  display: flex;
  gap: 0.75rem;
  justify-content: center;
`;

const NeuterTag = styled.div<{ $neutered?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 0;
  border: 2px solid #2C2420;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  box-shadow: 3px 3px 0px 0px #2C2420;
  transition: all 0.3s;
  background: ${props => props.$neutered ? '#556B2F' : 'rgba(255, 255, 255, 0.5)'};
  color: ${props => props.$neutered ? '#F5F2E9' : '#2C2420'};
`;


const LoadingContainer = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .loading-text {
    font-size: 1.25rem;
    color: #2C2420;
    font-family: var(--font-playfair), serif;
    font-weight: 600;
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
    font-weight: 700;
    color: #2C2420;
    font-family: var(--font-playfair), serif;
  }
  
  .star {
    color: #C5A059;
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
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  .icon-wrapper {
    width: 4rem;
    height: 4rem;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.$bgColor || 'rgba(197, 160, 89, 0.2)'};
    font-size: 1.75rem;
    border: 2px solid #2C2420;
    box-shadow: 3px 3px 0px 0px #2C2420;
    transition: all 0.3s;
  }

  &:hover .icon-wrapper {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px #2C2420;
  }
  
  .label {
    font-size: 0.875rem;
    color: #2C2420;
    font-weight: 600;
    font-family: var(--font-dm-sans), sans-serif;
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
    font-weight: 700;
    color: #2C2420;
    font-family: var(--font-playfair), serif;
  }
  
  .icon {
    color: #2C2420;
  }
`;

const DiscoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`;

const DiscoverCard = styled.button<{ $bgColor?: string }>`
  position: relative;
  padding: 2rem 1.5rem 5rem;
  border-radius: 0;
  border: 3px solid #2C2420;
  background: ${props => props.$bgColor || 'rgba(197, 160, 89, 0.15)'};
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 6px 6px 0px 0px #2C2420;
  
  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0px 0px #2C2420;
  }
  
  .icon-wrapper {
    width: 3rem;
    height: 3rem;
    border-radius: 0;
    background: #F5F2E9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    border: 2px solid #2C2420;
    box-shadow: 2px 2px 0px 0px #2C2420;
  }
  
  .title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2C2420;
    margin-bottom: 0.25rem;
    font-family: var(--font-playfair), serif;
  }
  
  .subtitle {
    font-size: 0.75rem;
    color: #5D4037;
    font-family: var(--font-dm-sans), sans-serif;
  }
  
  .action-button {
    position: absolute;
    bottom: 1.5rem;
    left: 1.5rem;
    background: #782221;
    color: #F5F2E9;
    border: 2px solid #2C2420;
    border-radius: 0;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s;
    font-family: var(--font-cinzel), serif;
    box-shadow: 2px 2px 0px 0px #2C2420;
    
    &:hover {
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px 0px #2C2420;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 36, 32, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
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
  border-radius: 0;
  background: linear-gradient(135deg, #782221, #9B2C2C);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: 2px solid #2C2420;
  background: transparent;
  cursor: pointer;
  color: #2C2420;
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

const PetTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  margin-bottom: 24px;
  box-shadow: 2px 2px 0px 0px #2C2420;
`;

const PetTagIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 0;
  background: linear-gradient(135deg, #C5A059, #782221);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  border: 2px solid #2C2420;
`;

const PetTagText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #2C2420;
  font-family: var(--font-playfair), serif;
`;

const ModalDescription = styled.p`
  color: #5D4037;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 24px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2C2420;
  margin-bottom: 12px;
  font-family: var(--font-playfair), serif;
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
  color: #782221;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 3px solid #2C2420;
  border-radius: 0;
  font-size: 16px;
  outline: none;
  transition: all 0.2s;
  background: white;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
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
  border-radius: 0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid #2C2420;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;

  ${props => props.variant === 'primary' ? `
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

  useEffect(() => {
    // 从本地存储获取用户ID
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData.id);
      loadPets(userData.id);
    } else {
      router.push('/auth/login');
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

    const prompt = generateDietPrompt(
      selectedPet.name,
      selectedPet.custom_breed || '狗狗',
      foodInput.trim()
    );

    const messages = [
      { role: 'system' as const, content: prompt },
      { role: 'user' as const, content: `请分析${selectedPet.name}是否可以吃${foodInput.trim()}` }
    ];

    try {
      const response = await chatNonStream(messages);
      if (response.content) {
        setQueryResult(response.content);
        setShowResult(true);
      }
    } catch (error) {
      console.error('查询错误:', error);
      setQueryResult('查询失败，请稍后重试');
    } finally {
      setIsQuerying(false);
    }
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
            {selectedPet.is_neutered ? (
              <NeuterTag $neutered>已绝育</NeuterTag>
            ) : (
              <NeuterTag>未绝育</NeuterTag>
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
                $bgColor="rgba(197, 160, 89, 0.2)"
                onClick={() => router.push('/medication')}
              >
                <div className="icon-wrapper">💙</div>
                <div className="label">用药</div>
              </QuickActionButton>
              
              <QuickActionButton 
                $bgColor="rgba(120, 34, 33, 0.12)"
                onClick={() => router.push('/reminders')}
              >
                <div className="icon-wrapper">⏰</div>
                <div className="label">提醒</div>
              </QuickActionButton>
              
              <QuickActionButton 
                $bgColor="rgba(93, 64, 55, 0.12)"
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
                $bgColor="rgba(197, 160, 89, 0.15)"
                onClick={() => router.push('/animal-knowledge')}
              >
                <div className="icon-wrapper">📚</div>
                <div className="title">动物小知识</div>
                <div className="subtitle">每日精选</div>
                <div className="action-button">去看看 ›</div>
              </DiscoverCard>
              
              <DiscoverCard 
                $bgColor="rgba(120, 34, 33, 0.1)"
                onClick={() => router.push('/pet-sticker')}
              >
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
                      <img src={selectedPet.avatar_url || selectedPet.photo_url} alt={selectedPet.name} style={{ width: '100%', height: '100%', borderRadius: '0', objectFit: 'cover' }} />
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
                  <ModalIconWrapper style={{ background: 'linear-gradient(135deg, #C5A059, #8B6914)' }}>
                    <Lightbulb size={24} />
                  </ModalIconWrapper>
                  <ModalTitle>智能分析结果</ModalTitle>
                </ModalHeader>

                <div style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '0', 
                  border: '3px solid #2C2420',
                  boxShadow: '4px 4px 0px 0px #2C2420',
                  marginBottom: '16px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  color: '#2C2420',
                  fontFamily: 'var(--font-dm-sans), sans-serif'
                }}>
                  {queryResult}
                </div>

                <div style={{
                  background: 'rgba(120, 34, 33, 0.08)',
                  border: '2px solid #782221',
                  borderRadius: '0',
                  padding: '16px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <AlertTriangle size={20} color="#782221" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#782221', fontSize: '14px', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
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
