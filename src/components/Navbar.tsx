'use client';

import Link from 'next/link';
import { Scroll, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 50;
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  svg {
    width: 32px;
    height: 32px;
    color: #782221;
    stroke-width: 1.5;
  }
`;

const LogoTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogoText = styled.span`
  font-size: 24px;
  font-weight: 900;
  font-family: var(--font-playfair), serif;
  letter-spacing: -0.02em;
  color: #2C2420;
  line-height: 1;

  i {
    color: #782221;
    font-style: italic;
    font-weight: 400;
  }
`;

const LogoSubtext = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #5D4037;
  font-family: var(--font-cinzel), serif;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 48px;
  font-size: 12px;
  font-weight: 700;
  color: #2C2420;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-family: var(--font-cinzel), serif;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.span`
  position: relative;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: #782221;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: #782221;
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const IconButton = styled.button`
  color: #2C2420;
  transition: color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #782221;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2C2420;
  transition: color 0.3s;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;

  &:hover {
    color: #782221;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  background: #782221;
  border-radius: 50%;
  font-size: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  border: 1px solid #F5F2E9;
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LoginLink = styled.span`
  color: #2C2420;
  font-weight: 700;
  padding: 8px 12px;
  transition: color 0.3s;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-cinzel), serif;

  &:hover {
    color: #782221;
  }
`;

const RegisterButton = styled.span`
  background: #782221;
  color: #F5F2E9;
  padding: 12px 24px;
  font-weight: 700;
  transition: all 0.3s;
  cursor: pointer;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
  font-family: var(--font-cinzel), serif;

  &:hover {
    background: #9B2C2C;
    transform: translateY(1px);
    box-shadow: 1px 1px 0px 0px #2C2420;
  }
`;

const UserSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(44, 36, 32, 0.1);

  &:hover {
    background: rgba(44, 36, 32, 0.05);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div<{ $hasImage: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #782221, #9B2C2C)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  font-weight: 700;
  font-size: 14px;
  overflow: hidden;
  border: 2px solid #F5F2E9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  color: #2C2420;
  font-weight: 700;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-cinzel), serif;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #F5F2E9;
  border: 1px solid rgba(44, 36, 32, 0.2);
  box-shadow: 4px 4px 0px 0px #2C2420;
  min-width: 180px;
  z-index: 50;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #2C2420;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-cinzel), serif;

  &:hover {
    background: rgba(120, 34, 33, 0.1);
    color: #782221;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const WelcomeText = styled.span`
  color: #5D4037;
  font-weight: 500;
  font-size: 12px;
  font-family: var(--font-dm-sans), sans-serif;

  @media (max-width: 768px) {
    display: none;
  }
`;

interface User {
  id: string;
  username?: string;
  full_name?: string;
  email: string;
  avatar_url?: string;
  is_email_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // 从 localStorage 读取用户信息
    const loadUserData = () => {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Failed to parse user data:', error);
          }
        }
      }
    };
    
    loadUserData();
    
    // 监听用户资料更新事件
    const handleUserUpdate = () => {
      loadUserData();
    };
    
    window.addEventListener('userProfileUpdated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleUserUpdate);
    };
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  };

  const getUserInitial = (name?: string) => {
    if (!name || name.length === 0) return '?';
    return name.charAt(0).toUpperCase();
  };

  return (
    <Nav>
      <NavContainer>
        {/* Logo */}
        <Link href="/">
          <Logo>
            <Scroll />
            <LogoTextContainer>
              <LogoText>爪爪<i>管家</i></LogoText>
              <LogoSubtext>Est. MMXXIII</LogoSubtext>
            </LogoTextContainer>
          </Logo>
        </Link>

        {/* Navigation Links */}
        <NavLinks>
          <Link href="/">
            <NavLink>首页</NavLink>
          </Link>
          <Link href="/my-pets">
            <NavLink>我的宠物</NavLink>
          </Link>
          <Link href="/assistant">
            <NavLink>智能助手</NavLink>
          </Link>
          <Link href="/animal-knowledge">
            <NavLink>宠物百科</NavLink>
          </Link>
        </NavLinks>

        {/* Right Side */}
        <RightSection>
          {/* Login/Register or User Info */}
          <AuthSection>
            {!isMounted ? (
              <div style={{ width: '120px', height: '40px' }}></div>
            ) : user ? (
              <UserSection
                ref={userMenuRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <UserInfo>
                  <UserAvatar $hasImage={!!user.avatar_url}>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="用户头像" />
                    ) : (
                      getUserInitial(user.username || user.full_name)
                    )}
                  </UserAvatar>
                  <UserName>{user.username || user.full_name || '用户'}</UserName>
                  <ChevronDown size={16} />
                </UserInfo>
                <DropdownMenu $isOpen={isDropdownOpen}>
                  <Link href="/profile">
                    <MenuItem>
                      <User size={18} />
                      <span>个人中心</span>
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>退出登录</span>
                  </MenuItem>
                </DropdownMenu>
              </UserSection>
            ) : (
              <>
                <Link href="/auth/login">
                  <LoginLink>登录</LoginLink>
                </Link>
                <Link href="/auth/register">
                  <RegisterButton>注册</RegisterButton>
                </Link>
              </>
            )}
          </AuthSection>
        </RightSection>
      </NavContainer>
    </Nav>
  );
}
