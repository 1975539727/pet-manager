'use client';

import Link from 'next/link';
import { Search, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: white;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border-bottom: 1px solid #e5e7eb;
`;

const NavContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #ea580c;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.span`
  color: #374151;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #ea580c;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.5rem;
  color: #4b5563;
  transition: color 0.2s;

  &:hover {
    color: #ea580c;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoginLink = styled.span`
  color: #374151;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #ea580c;
  }
`;

const Separator = styled.span`
  color: #d1d5db;
`;

const RegisterButton = styled.span`
  background-color: #ea580c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: #c2410c;
  }
`;

const UserSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f9fafb;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.div<{ $hasImage: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  color: #374151;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  z-index: 50;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;

  &:first-child {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
  }

  &:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  &:hover {
    background-color: #f9fafb;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const WelcomeText = styled.span`
  color: #374151;
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchBarContainer = styled.div`
  padding-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;

  &:focus {
    border-color: #ea580c;
    box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.2);
  }
`;

const MobileMenu = styled.div`
  display: block;
  padding: 0 1rem 0.75rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuLink = styled.span`
  display: block;
  color: #374151;
  padding: 0.5rem 0;
  transition: color 0.2s;
  cursor: pointer;

  &:hover {
    color: #ea580c;
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        <NavContent>
          {/* Logo and Navigation Links */}
          <LeftSection>
            {/* Logo */}
            <Link href="/">
              <Logo>
                <LogoText>🐾 爪爪管家</LogoText>
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
              <Link href="/profile">
                <NavLink>我的</NavLink>
              </Link>
            </NavLinks>
          </LeftSection>

          {/* Right Side: Search and Auth */}
          <RightSection>
            {/* Search Icon */}
            <SearchButton 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="搜索"
            >
              <Search size={20} />
            </SearchButton>

            {/* Login/Register or User Info */}
            <AuthSection>
              {!isMounted ? (
                // 服务器端渲染时显示占位符
                <div style={{ width: '120px', height: '40px' }}></div>
              ) : user ? (
                <UserSection 
                  ref={userMenuRef}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <UserInfo>
                    <WelcomeText>欢迎回来，</WelcomeText>
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
                  <Separator>|</Separator>
                  <Link href="/auth/register">
                    <RegisterButton>注册</RegisterButton>
                  </Link>
                </>
              )}
            </AuthSection>
          </RightSection>
        </NavContent>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && (
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="搜索宠物信息..."
              autoFocus
            />
          </SearchBarContainer>
        )}
      </NavContainer>

      {/* Mobile Menu */}
      <MobileMenu>
        <Link href="/">
          <MobileMenuLink>首页</MobileMenuLink>
        </Link>
        <Link href="/my-pets">
          <MobileMenuLink>我的宠物</MobileMenuLink>
        </Link>
        <Link href="/assistant">
          <MobileMenuLink>智能助手</MobileMenuLink>
        </Link>
        <Link href="/profile">
          <MobileMenuLink>我的</MobileMenuLink>
        </Link>
      </MobileMenu>
    </Nav>
  );
}
