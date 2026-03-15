'use client';

import styled from 'styled-components';
import { User, Mail, FileText, Users, Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Container = styled.div`
  width: 100%;
  padding: 0;
  background: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #1f2937;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  
  &:hover {
    color: #ea580c;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Content = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const Avatar = styled.div<{ $hasImage: boolean }>`
  width: 4.5rem;
  height: 4.5rem;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarIcon = styled.div`
  font-size: 1.75rem;
  color: #f87171;
`;

const UserInfoContainer = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const UserInfo = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

const EditButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background: #6d28d9;
  }
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding: 0 0 0 1rem;
`;

const DetailCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 2px solid #000;
  overflow: hidden;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: #7c3aed;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ActionButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #6d28d9;
  }
`;

interface User {
  id: string;
  username?: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  gender?: string;
  birth_date?: string;
  is_email_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  last_login_at?: string;
}

export default function ProfileDetailPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 读取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '未知';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(/\//g, '-');
    } catch {
      return '未知';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '未设置';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
    } catch {
      return '未设置';
    }
  };

  if (loading || !user) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </BackButton>
          <Title>个人资料</Title>
        </Header>
      </Container>
    );
  }

  const displayName = user.username || user.full_name || '用户';

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </BackButton>
        <Title>个人资料</Title>
      </Header>

      <Content>
        {/* 用户信息卡片 */}
        <ProfileCard>
          <Avatar $hasImage={!!user.avatar_url}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="用户头像" />
            ) : (
              <AvatarIcon>
                <User size={28} />
              </AvatarIcon>
            )}
          </Avatar>
          <UserInfoContainer>
            <UserName>{displayName}</UserName>
            <UserInfo>账号：{user.username || 'gjy'}</UserInfo>
            <UserInfo>邮箱：{user.email}</UserInfo>
            <UserInfo>最近登录：{formatDateTime(user.last_login_at || user.created_at)}</UserInfo>
          </UserInfoContainer>
          <Link href="/profile/edit">
            <EditButton>
              ✏️ 编辑
            </EditButton>
          </Link>
        </ProfileCard>

        {/* 详细信息 */}
        <Section>
          <SectionTitle>详细信息</SectionTitle>
          <DetailCard>
            <DetailItem>
              <DetailIcon>
                <Mail size={20} />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>邮箱</DetailLabel>
                <DetailValue>{user.email}</DetailValue>
              </DetailContent>
              <ActionButton>更换</ActionButton>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <FileText size={20} />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>个人简介</DetailLabel>
                <DetailValue>{user.bio || '未填写'}</DetailValue>
              </DetailContent>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <Users size={20} />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>性别</DetailLabel>
                <DetailValue>{user.gender || '男'}</DetailValue>
              </DetailContent>
            </DetailItem>

            <DetailItem>
              <DetailIcon>
                <Calendar size={20} />
              </DetailIcon>
              <DetailContent>
                <DetailLabel>出生日期</DetailLabel>
                <DetailValue>{formatDate(user.birth_date)}</DetailValue>
              </DetailContent>
            </DetailItem>
          </DetailCard>
        </Section>
      </Content>
    </Container>
  );
}
