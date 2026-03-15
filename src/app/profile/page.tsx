'use client';

import styled from 'styled-components';
import { User, Settings, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
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
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const UserInfoContainer = styled.div`
  flex: 1;
`;

const UserInfo = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0.25rem 0;
`;

const MenuCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 2px solid #000;
  overflow: hidden;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9fafb;
  }
`;

const MenuIcon = styled.div<{ $bgColor: string; $iconColor: string }>`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.$bgColor};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$iconColor};
  flex-shrink: 0;
`;

const MenuContent = styled.div`
  flex: 1;
`;

const MenuTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
`;

const MenuDescription = styled.p`
  color: #9ca3af;
  font-size: 0.75rem;
  margin: 0;
`;

const AvatarIcon = styled.div`
  font-size: 1.75rem;
  color: #f87171;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
`;

const LoginButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #ea580c;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #c2410c;
  }
`;

interface User {
  id: string;
  username?: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_email_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  last_login_at?: string;
}

export default function ProfilePage() {
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

  const getUserInitial = (name?: string) => {
    if (!name || name.length === 0) return '?';
    return name.charAt(0).toUpperCase();
  };

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

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>我的</Title>
        </Header>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Header>
          <Title>我的</Title>
        </Header>
        <LoginPrompt>
          <User size={48} color="#ea580c" style={{ margin: '0 auto 1rem' }} />
          <UserName>您还未登录</UserName>
          <UserInfo>登录后可以管理您的个人信息和宠物档案</UserInfo>
          <Link href="/auth/login">
            <LoginButton>立即登录</LoginButton>
          </Link>
        </LoginPrompt>
      </Container>
    );
  }

  const displayName = user.username || user.full_name || '用户';
  const displayPhone = user.phone || user.email;
  const lastLogin = formatDateTime(user.last_login_at || user.created_at);

  return (
    <Container>
      <Header>
        <Title>我的</Title>
      </Header>

      <ProfileSection>
        {/* 用户信息卡片 */}
        <ProfileCard>
          <Avatar>
            <AvatarIcon>
              <User size={28} />
            </AvatarIcon>
          </Avatar>
          <UserInfoContainer>
            <UserName>{displayName}</UserName>
            <UserInfo>{displayPhone}</UserInfo>
            <UserInfo>最近登录：{lastLogin}</UserInfo>
          </UserInfoContainer>
        </ProfileCard>

        {/* 功能菜单 */}
        <MenuCard>
          <Link href="/profile/detail" style={{ textDecoration: 'none', color: 'inherit' }}>
            <MenuItem>
              <MenuIcon $bgColor="#ddd6fe" $iconColor="#7c3aed">
                <User size={20} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>个人资料</MenuTitle>
                <MenuDescription>头像、昵称、简介等</MenuDescription>
              </MenuContent>
              <ChevronRight size={20} color="#9ca3af" />
            </MenuItem>
          </Link>
          
          <MenuItem>
            <MenuIcon $bgColor="#fed7aa" $iconColor="#ea580c">
              <Settings size={20} />
            </MenuIcon>
            <MenuContent>
              <MenuTitle>设置</MenuTitle>
              <MenuDescription>账号、通知、隐私等</MenuDescription>
            </MenuContent>
            <ChevronRight size={20} color="#9ca3af" />
          </MenuItem>
        </MenuCard>
      </ProfileSection>
    </Container>
  );
}
