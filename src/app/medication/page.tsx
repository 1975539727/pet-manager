'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, ArrowLeft, Pill } from 'lucide-react';
import { getUserPets } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
`;

const Header = styled.div`
  background: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
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
  background: transparent;
  border: none;
  cursor: pointer;
  color: #1f2937;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #f97316;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const AddButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #1f2937;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #f97316;
  }
`;

const TabContainer = styled.div`
  background: white;
  display: flex;
  border-bottom: 1px solid #e5e7eb;
`;

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.$active ? '#8b5cf6' : '#6b7280'};
  border-bottom: ${props => props.$active ? '2px solid #8b5cf6' : '2px solid transparent'};
  transition: all 0.2s;
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    color: #8b5cf6;
  }
`;

const ContentContainer = styled.div`
  padding: 2rem 1rem;
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 60rem;
  margin: 0 auto;
  border: 3px solid #1f2937;
  
  .icon-wrapper {
    width: 5rem;
    height: 5rem;
    background: #8b5cf6;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    
    svg {
      color: white;
    }
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    color: #6b7280;
  }
`;

export default function MedicationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [currentPet, setCurrentPet] = useState<UserPet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      loadPets(userData.id);
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadPets = async (uid: string) => {
    setLoading(true);
    const data = await getUserPets(uid, false);
    if (data.length > 0) {
      setCurrentPet(data[0]);
    }
    setLoading(false);
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
          <Title>{currentPet?.name || '宠物'} 的用药</Title>
        </HeaderLeft>
        <AddButton>
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
        <EmptyState>
          <div className="icon-wrapper">
            <Pill size={40} />
          </div>
          <h3>暂无用药计划</h3>
          <p>点击右上角 + 即可新增计划。</p>
        </EmptyState>
      </ContentContainer>
    </PageContainer>
  );
}
