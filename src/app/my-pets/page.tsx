'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { PlusCircle, Edit, Archive, Trash2, Heart, Calendar, Weight, FileText } from 'lucide-react';
import { getUserPets, archiveUserPet, deleteUserPet } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ea580c;
  }
  
  p {
    font-size: 0.875rem;
    color: #4b5563;
    margin-top: 0.25rem;
  }
`;

const AddButton = styled.button`
  background: #f97316;
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  
  &:hover {
    background: #ea580c;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    color: #f97316;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
    
    &:focus {
      outline: 2px solid #f97316;
      outline-offset: 2px;
    }
  }
  
  span {
    font-size: 0.875rem;
    color: #374151;
  }
`;

const CountText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 0;
  
  .emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }
`;

const PetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PetCard = styled.div<{ $archived?: boolean }>`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s;
  opacity: ${props => props.$archived ? 0.6 : 1};
  
  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

const PetPhoto = styled.div`
  position: relative;
  height: 12rem;
  background: linear-gradient(to bottom right, #fed7aa, #fecaca);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .photo-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
  }
`;

const ArchivedBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(31, 41, 55, 0.8);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const PetInfo = styled.div`
  padding: 1.5rem;
`;

const PetHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1f2937;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .gender {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #4b5563;
  }
`;

const PetDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  
  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'blue' | 'gray' | 'red' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  
  ${props => {
    switch (props.$variant) {
      case 'blue':
        return `
          background: #3b82f6;
          &:hover { background: #2563eb; }
        `;
      case 'gray':
        return `
          background: #6b7280;
          &:hover { background: #4b5563; }
        `;
      case 'red':
        return `
          background: #ef4444;
          &:hover { background: #dc2626; }
        `;
      default:
        return `
          background: #f97316;
          &:hover { background: #ea580c; }
        `;
    }
  }}
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

export default function MyPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<UserPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const [userId, setUserId] = useState<string>('');

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

  const loadPets = async (uid: string) => {
    setLoading(true);
    const data = await getUserPets(uid, showArchived);
    setPets(data);
    setLoading(false);
  };

  const handleArchive = async (petId: string) => {
    if (confirm('确定要归档这个宠物档案吗?')) {
      const success = await archiveUserPet(petId);
      if (success && userId) {
        loadPets(userId);
      }
    }
  };

  const handleDelete = async (petId: string) => {
    if (confirm('确定要删除这个宠物档案吗?此操作不可恢复!')) {
      const success = await deleteUserPet(petId);
      if (success && userId) {
        loadPets(userId);
      }
    }
  };

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return '未知';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months}个月`;
    } else if (months < 0) {
      return `${years - 1}岁${12 + months}个月`;
    } else {
      return months === 0 ? `${years}岁` : `${years}岁${months}个月`;
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-text">加载中...</div>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderTitle>
            <h1>🐾 我的宠物</h1>
            <p>管理您的宠物档案</p>
          </HeaderTitle>
          <AddButton onClick={() => router.push('/my-pets/add')}>
            <PlusCircle size={20} />
            添加宠物
          </AddButton>
        </HeaderContent>
      </Header>

      <Main>
        <FilterSection>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => {
                setShowArchived(e.target.checked);
                if (userId) loadPets(userId);
              }}
            />
            <span>显示已归档宠物</span>
          </CheckboxLabel>
          <CountText>
            共 {pets.length} 只宠物
          </CountText>
        </FilterSection>

        {pets.length === 0 ? (
          <EmptyState>
            <div className="emoji">🐶</div>
            <h3>还没有宠物档案</h3>
            <p>点击上方按钮开始添加您的第一只宠物吧!</p>
            <AddButton onClick={() => router.push('/my-pets/add')}>
              <PlusCircle size={20} />
              添加宠物
            </AddButton>
          </EmptyState>
        ) : (
          <PetGrid>
            {pets.map((pet) => (
              <PetCard key={pet.id} $archived={pet.status === 'archived'}>
                <PetPhoto>
                  {pet.photo_url ? (
                    <img src={pet.photo_url} alt={pet.name} />
                  ) : (
                    <div className="photo-placeholder">🐾</div>
                  )}
                  {pet.status === 'archived' && (
                    <ArchivedBadge>已归档</ArchivedBadge>
                  )}
                </PetPhoto>

                <PetInfo>
                  <PetHeader>
                    <div>
                      <h3>{pet.name}</h3>
                      <p>{pet.custom_breed || '未知品种'}</p>
                    </div>
                    <div className="gender">
                      {pet.gender === 'male' ? '♂️' : pet.gender === 'female' ? '♀️' : '❓'}
                    </div>
                  </PetHeader>

                  <PetDetails>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>年龄: {calculateAge(pet.birth_date)}</span>
                    </div>
                    {pet.weight && (
                      <div className="detail-item">
                        <Weight size={16} />
                        <span>体重: {pet.weight} {pet.weight_unit || 'kg'}</span>
                      </div>
                    )}
                    {pet.is_neutered !== undefined && (
                      <div className="detail-item">
                        <Heart size={16} />
                        <span>{pet.is_neutered ? '已绝育' : '未绝育'}</span>
                      </div>
                    )}
                  </PetDetails>

                  <ButtonGrid>
                    <ActionButton onClick={() => router.push(`/my-pets/${pet.id}`)}>
                      <FileText size={16} />
                      详情
                    </ActionButton>
                    <ActionButton $variant="blue" onClick={() => router.push(`/my-pets/${pet.id}/edit`)}>
                      <Edit size={16} />
                      编辑
                    </ActionButton>
                    {pet.status === 'active' && (
                      <>
                        <ActionButton $variant="gray" onClick={() => handleArchive(pet.id)}>
                          <Archive size={16} />
                          归档
                        </ActionButton>
                        <ActionButton $variant="red" onClick={() => handleDelete(pet.id)}>
                          <Trash2 size={16} />
                          删除
                        </ActionButton>
                      </>
                    )}
                  </ButtonGrid>
                </PetInfo>
              </PetCard>
            ))}
          </PetGrid>
        )}
      </Main>
    </PageContainer>
  );
}
