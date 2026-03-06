'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, Edit, Trash2, MoreVertical, Hourglass } from 'lucide-react';
import { getUserPets, deleteUserPet } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';

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

export default function MyPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<UserPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
                {pet.photo_url ? (
                  <img src={pet.photo_url} alt={pet.name} />
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
              {selectedPet.photo_url ? (
                <img src={selectedPet.photo_url} alt={selectedPet.name} />
              ) : (
                <div className="placeholder">🐾</div>
              )}
            </PetAvatar2>
            <PetTitleSection>
              <h2>
                {selectedPet.name}
                {selectedPet.gender === 'male' && <span>♂️</span>}
                {selectedPet.gender === 'female' && <span>♀️</span>}
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
            <TagButton>✅ 已绝育</TagButton>
          </CardFooter>
        </PetDetailCard>
      )}
      
      {pets.length > 0 && selectedPet && (
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
            >
              <div className="icon-wrapper">🍴</div>
              <div className="label">饮食</div>
            </QuickActionButton>
          </QuickActionsGrid>
        </QuickActionsSection>
      )}
    </PageContainer>
  );
}
