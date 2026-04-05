'use client';

import styled from 'styled-components';
import { User, Settings, ChevronRight, ArrowLeft, Lock, KeyRound, Trash2, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
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
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px #2C2420;
  }
`;

const Avatar = styled.div`
  width: 4.5rem;
  height: 4.5rem;
  background: linear-gradient(135deg, #C5A059, #782221);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  font-size: 2rem;
  flex-shrink: 0;
  border: 3px solid #2C2420;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 0.25rem 0;
  font-family: var(--font-playfair), serif;
`;

const UserInfoContainer = styled.div`
  flex: 1;
`;

const UserInfo = styled.p`
  color: #5D4037;
  font-size: 0.875rem;
  margin: 0.25rem 0;
  font-family: var(--font-dm-sans), sans-serif;
`;

const MenuCard = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  overflow: hidden;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(120, 34, 33, 0.05);
  }
`;

const MenuIcon = styled.div<{ $bgColor?: string; $iconColor?: string }>`
  width: 2.5rem;
  height: 2.5rem;
  background: ${props => props.$bgColor || 'linear-gradient(135deg, #782221, #9B2C2C)'};
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$iconColor || '#F5F2E9'};
  flex-shrink: 0;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
`;

const MenuContent = styled.div`
  flex: 1;
`;

const MenuTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #2C2420;
  margin: 0 0 0.25rem 0;
  font-family: var(--font-playfair), serif;
`;

const MenuDescription = styled.p`
  color: #5D4037;
  font-size: 0.75rem;
  margin: 0;
  font-family: var(--font-dm-sans), sans-serif;
`;

const AvatarIcon = styled.div`
  font-size: 1.75rem;
  color: #f87171;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const SettingsModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  z-index: 1000;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease-in-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C2420;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const ModalTitle = styled.h2`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.125rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const ModalContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.875rem;
  color: #5D4037;
  margin: 0 0 0.5rem 0.5rem;
  font-weight: 600;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const ConfirmModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 36, 32, 0.6);
  z-index: 2000;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ConfirmDialog = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 1.5rem;
  max-width: 20rem;
  width: 100%;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
`;

const ConfirmTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-playfair), serif;
`;

const ConfirmMessage = styled.p`
  color: #5D4037;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  font-family: var(--font-dm-sans), sans-serif;
`;

const ConfirmButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ConfirmButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  
  background: ${props => props.$variant === 'primary' ? '#782221' : 'transparent'};
  color: ${props => props.$variant === 'primary' ? '#F5F2E9' : '#2C2420'};
  box-shadow: ${props => props.$variant === 'primary' ? '3px 3px 0px 0px #2C2420' : 'none'};
  
  &:hover {
    ${props => props.$variant === 'primary' ? `
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px 0px #2C2420;
    ` : `
      background: rgba(44, 36, 32, 0.05);
    `}
  }
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 3rem;
  background: #F5F2E9;
  border-radius: 0;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  margin: 0 1rem;
`;

const LoginButton = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #782221;
  color: #F5F2E9;
  border-radius: 0;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px #2C2420;
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
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setShowLogoutConfirm(false);
    setShowSettings(false);
    router.push('/auth/login');
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
          <User size={48} color="#782221" style={{ margin: '0 auto 1rem' }} />
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
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={displayName} />
            ) : (
              <AvatarIcon>
                <User size={28} />
              </AvatarIcon>
            )}
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
              <MenuIcon>
                <User size={20} />
              </MenuIcon>
              <MenuContent>
                <MenuTitle>个人资料</MenuTitle>
                <MenuDescription>头像、昵称、简介等</MenuDescription>
              </MenuContent>
              <ChevronRight size={20} color="#5D4037" />
            </MenuItem>
          </Link>
          
          <MenuItem onClick={() => setShowSettings(true)}>
            <MenuIcon>
              <Settings size={20} />
            </MenuIcon>
            <MenuContent>
              <MenuTitle>设置</MenuTitle>
              <MenuDescription>账号、通知、隐私等</MenuDescription>
            </MenuContent>
            <ChevronRight size={20} color="#5D4037" />
          </MenuItem>
        </MenuCard>
      </ProfileSection>

      {/* 设置弹出层 */}
      <SettingsModal $isOpen={showSettings}>
        <ModalHeader>
          <BackButton onClick={() => setShowSettings(false)}>
            <ArrowLeft size={24} />
          </BackButton>
          <ModalTitle>设置</ModalTitle>
        </ModalHeader>
        
        <ModalContent>
          {/* 账号设置 */}
          <div>
            <SectionTitle>账号设置</SectionTitle>
            <MenuCard>
              <Link href="/profile/detail" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem>
                  <MenuIcon>
                    <User size={20} />
                  </MenuIcon>
                  <MenuContent>
                    <MenuTitle>个人资料</MenuTitle>
                    <MenuDescription>修改头像、昵称、简介等信息</MenuDescription>
                  </MenuContent>
                  <ChevronRight size={20} color="#5D4037" />
                </MenuItem>
              </Link>
              
              <Link href="/profile/change-password" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem>
                  <MenuIcon>
                    <Lock size={20} />
                  </MenuIcon>
                  <MenuContent>
                    <MenuTitle>修改密码</MenuTitle>
                    <MenuDescription>重新设置登录密码</MenuDescription>
                  </MenuContent>
                  <ChevronRight size={20} color="#5D4037" />
                </MenuItem>
              </Link>
              
              <Link href="/auth/forgot-password" style={{ textDecoration: 'none', color: 'inherit' }}>
                <MenuItem>
                  <MenuIcon>
                    <KeyRound size={20} />
                  </MenuIcon>
                  <MenuContent>
                    <MenuTitle>找回密码</MenuTitle>
                    <MenuDescription>通过邮箱验证重置登录密码</MenuDescription>
                  </MenuContent>
                  <ChevronRight size={20} color="#5D4037" />
                </MenuItem>
              </Link>
            </MenuCard>
          </div>

          {/* 其他 */}
          <div>
            <SectionTitle>其他</SectionTitle>
            <MenuCard>
              <MenuItem onClick={() => setShowLogoutConfirm(true)}>
                <MenuIcon $bgColor="rgba(120, 34, 33, 0.15)" $iconColor="#782221">
                  <LogOut size={20} />
                </MenuIcon>
                <MenuContent>
                  <MenuTitle>退出登录</MenuTitle>
                  <MenuDescription>退出当前账号</MenuDescription>
                </MenuContent>
                <ChevronRight size={20} color="#5D4037" />
              </MenuItem>
            </MenuCard>
          </div>
        </ModalContent>
      </SettingsModal>

      {/* 退出登录确认弹窗 */}
      <ConfirmModal $isOpen={showLogoutConfirm}>
        <ConfirmDialog>
          <ConfirmTitle>
            <LogOut size={20} color="#782221" />
            退出登录
          </ConfirmTitle>
          <ConfirmMessage>
            确定要退出当前账号吗？退出后需要重新登录才能使用完整功能。
          </ConfirmMessage>
          <ConfirmButtons>
            <ConfirmButton onClick={() => setShowLogoutConfirm(false)}>取消</ConfirmButton>
            <ConfirmButton $variant="primary" onClick={handleLogout}>确认退出</ConfirmButton>
          </ConfirmButtons>
        </ConfirmDialog>
      </ConfirmModal>
    </Container>
  );
}
