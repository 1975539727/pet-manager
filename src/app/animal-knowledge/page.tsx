'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPublishedAnimalKnowledge } from '@/lib/api/animalKnowledge';
import { AnimalKnowledge } from '@/lib/supabase';

const Container = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  padding-bottom: 2rem;
  padding-top: 96px;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(44, 36, 32, 0.1);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  z-index: 50;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  color: #2C2420;
  cursor: pointer;
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

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const KnowledgeCard = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 6px 6px 0px 0px #2C2420;
  border: 3px solid #2C2420;
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px #2C2420;
  }
`;

const KnowledgeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const DateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #782221;
  color: #F5F2E9;
  padding: 0.5rem 1rem;
  border-radius: 0;
  font-size: 0.875rem;
  font-weight: 600;
  border: 2px solid #2C2420;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const KnowledgeContent = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-dm-sans), sans-serif;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #F5F2E9;
  border-radius: 0;
  box-shadow: 6px 6px 0px 0px #2C2420;
  border: 3px solid #2C2420;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: #5D4037;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #2C2420;
  font-size: 1.125rem;
  font-family: var(--font-playfair), serif;
`;

export default function AnimalKnowledgePage() {
  const router = useRouter();
  const [knowledgeList, setKnowledgeList] = useState<AnimalKnowledge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从数据库获取数据
    const fetchKnowledge = async () => {
      setLoading(true);
      const data = await getPublishedAnimalKnowledge();
      setKnowledgeList(data);
      setLoading(false);
    };

    fetchKnowledge();
  }, []);

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </BackButton>
        <Title>动物世界-今日小知识</Title>
      </Header>

      <Content>
        {loading ? (
          <LoadingState>加载中...</LoadingState>
        ) : knowledgeList.length === 0 ? (
          <EmptyState>
            <EmptyIcon>📚</EmptyIcon>
            <EmptyText>暂无小知识，请稍后再来</EmptyText>
          </EmptyState>
        ) : (
          knowledgeList.map((knowledge) => (
            <KnowledgeCard key={knowledge.id}>
              <KnowledgeHeader>
                <DateBadge>
                  <Calendar />
                  {formatDateTime(knowledge.publish_datetime)}
                </DateBadge>
              </KnowledgeHeader>
              <KnowledgeContent>{knowledge.content}</KnowledgeContent>
            </KnowledgeCard>
          ))
        )}
      </Content>
    </Container>
  );
}
