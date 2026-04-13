'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, ArrowLeft, Pill } from 'lucide-react';
import { getUserPets } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';

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
  padding: 2rem 1rem;
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
      router.push('/auth/login');
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
