'use client';

import styled from 'styled-components';
import { User, Mail, FileText, Users, Calendar, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Container = styled.div`
  width: 100%;
  padding: 0;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  min-height: 100vh;
  padding-top: 96px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  z-index: 100;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const Content = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileCard = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 1.5rem;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px #2C2420;
  }
`;

const Avatar = styled.div<{ $hasImage: boolean }>`
  width: 4.5rem;
  height: 4.5rem;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #C5A059, #782221)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  font-size: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  border: 3px solid #2C2420;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: sepia(0.15) contrast(1.05);
  }
`;

const AvatarIcon = styled.div`
  font-size: 1.75rem;
  color: #F5F2E9;
`;

const UserInfoContainer = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 0.25rem 0;
  font-family: var(--font-playfair), serif;
`;

const UserInfo = styled.p`
  color: #5D4037;
  font-size: 0.875rem;
  margin: 0.25rem 0;
  font-family: var(--font-dm-sans), sans-serif;
`;

const EditButton = styled.button`
  background: #782221;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 3px 3px 0px 0px #2C2420;
  transition: all 0.3s;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  
  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px #2C2420;
  }
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 1rem 0;
  padding: 0 0 0 1rem;
  font-family: var(--font-playfair), serif;
`;

const DetailCard = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  overflow: hidden;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #782221, #9B2C2C);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  flex-shrink: 0;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
`;

const DetailContent = styled.div`
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #2C2420;
  margin-bottom: 0.25rem;
  font-family: var(--font-playfair), serif;
`;

const DetailValue = styled.div`
  font-size: 0.875rem;
  color: #5D4037;
  font-family: var(--font-dm-sans), sans-serif;
`;

const ActionButton = styled.button`
  background: #782221;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 2px 2px 0px 0px #2C2420;
  transition: all 0.3s;
  font-family: var(--font-cinzel), serif;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px 0px #2C2420;
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
