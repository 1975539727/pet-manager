'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useState } from 'react';
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

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
              <Link href="/encyclopedia">
                <NavLink>宠物百科</NavLink>
              </Link>
              <Link href="/archives">
                <NavLink>宠物档案</NavLink>
              </Link>
              <Link href="/assistant">
                <NavLink>智能助手</NavLink>
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

            {/* Login/Register */}
            <AuthSection>
              <Link href="/login">
                <LoginLink>登录</LoginLink>
              </Link>
              <Separator>|</Separator>
              <Link href="/register">
                <RegisterButton>注册</RegisterButton>
              </Link>
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
        <Link href="/encyclopedia">
          <MobileMenuLink>宠物百科</MobileMenuLink>
        </Link>
        <Link href="/archives">
          <MobileMenuLink>宠物档案</MobileMenuLink>
        </Link>
        <Link href="/assistant">
          <MobileMenuLink>智能助手</MobileMenuLink>
        </Link>
      </MobileMenu>
    </Nav>
  );
}
