'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getPublishedAnimalKnowledge } from '@/lib/api/animalKnowledge';
import { AnimalKnowledge } from '@/lib/supabase';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 2rem;
`;

const Header = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const KnowledgeCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

const KnowledgeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
`;

const DateBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CategoryTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #fef3c7;
  color: #92400e;
  padding: 0.375rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
`;

const KnowledgeContent = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: white;
  font-size: 1.125rem;
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
                <CategoryTag>趣味</CategoryTag>
              </KnowledgeHeader>
              <KnowledgeContent>{knowledge.content}</KnowledgeContent>
            </KnowledgeCard>
          ))
        )}
      </Content>
    </Container>
  );
}
