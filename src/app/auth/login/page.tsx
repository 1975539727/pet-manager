'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Eye, EyeOff, Scroll } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 40px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const Card = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 48px 40px;
  width: 100%;
  max-width: 440px;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
  transition: all 0.3s;

  &:hover {
    box-shadow: 12px 12px 0px 0px #2C2420;
    transform: translate(-2px, -2px);
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 120px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  color: #2C2420;
  text-decoration: none;
  border-radius: 0;
  font-weight: 700;
  transition: all 0.3s;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-cinzel), serif;

  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px 0px #2C2420;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 36px;
`;

const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  .logo-wrapper {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #782221, #9B2C2C);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #2C2420;
    box-shadow: 3px 3px 0px 0px #2C2420;
    color: #F5F2E9;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2C2420;
  margin-bottom: 8px;
  font-family: var(--font-playfair), serif;
`;

const Subtitle = styled.p`
  color: #5D4037;
  font-size: 14px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(44, 36, 32, 0.2);
  }

  span {
    font-size: 10px;
    color: #5D4037;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-family: var(--font-cinzel), serif;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #2C2420;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-cinzel), serif;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 48px 14px 16px;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 16px;
  transition: all 0.2s;
  background: white;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;

  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }

  &::placeholder {
    color: #aaa;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #782221;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #782221;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #9B2C2C;
  }
`;

const RememberGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -8px;
`;

const CheckboxGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #5D4037;
  font-size: 14px;
  font-family: var(--font-dm-sans), sans-serif;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #782221;
    cursor: pointer;
  }
`;

const ForgotLink = styled(Link)`
  color: #782221;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-cinzel), serif;
  transition: color 0.3s;

  &:hover {
    color: #9B2C2C;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #782221;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
  box-shadow: 4px 4px 0px 0px #2C2420;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: var(--font-cinzel), serif;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px #2C2420;
    background: #9B2C2C;
  }

  &:active:not(:disabled) {
    transform: translate(0, 0);
    box-shadow: 2px 2px 0px 0px #2C2420;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(44, 36, 32, 0.15);
  color: #5D4037;
  font-size: 14px;
  font-family: var(--font-dm-sans), sans-serif;

  a {
    color: #782221;
    text-decoration: none;
    font-weight: 700;
    font-family: var(--font-cinzel), serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 12px;
    margin-left: 4px;
    transition: color 0.3s;

    &:hover {
      color: #9B2C2C;
    }
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px 16px;
  border-radius: 0;
  margin-bottom: 16px;
  font-weight: 600;
  border: 2px solid #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  
  ${props => props.type === 'success' && `
    background: rgba(85, 107, 47, 0.15);
    color: #556B2F;
    border-color: #556B2F;
  `}
  
  ${props => props.type === 'error' && `
    background: rgba(120, 34, 33, 0.1);
    color: #782221;
    border-color: #782221;
  `}
`;

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    remember: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基础验证
    if (!formData.email || !/^\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: '请输入有效邮箱地址' });
      return;
    }

    if (!formData.password) {
      setMessage({ type: 'error', text: '请输入密码' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        
        // 保存用户信息到localStorage（简单实现，生产环境建议用更安全的方式）
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }

        // 跳转到首页
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '登录失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  return (
    <Container>
      <BackButton href="/">
        <ArrowLeft size={18} />
        返回首页
      </BackButton>

      <Card>
        <Header>
          <LogoIcon>
            <div className="logo-wrapper">
              <Scroll size={32} />
            </div>
          </LogoIcon>
          <Title>登录爪爪管家</Title>
          <Subtitle>欢迎回来，让我们继续照顾您的爱宠</Subtitle>
        </Header>

        <Divider><span>Account Login</span></Divider>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <Form onSubmit={handleSubmit}>
          <div>
            <InputLabel>邮箱地址</InputLabel>
            <InputGroup>
              <Input
                type="email"
                placeholder="请输入邮箱地址"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
            </InputGroup>
          </div>

          <div>
            <InputLabel>密码</InputLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputGroup>
          </div>

          <RememberGroup>
            <CheckboxGroup>
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => handleInputChange('remember', e.target.checked)}
              />
              记住我
            </CheckboxGroup>
            <ForgotLink href="/auth/forgot-password">
              忘记密码？
            </ForgotLink>
          </RememberGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </SubmitButton>
        </Form>

        <RegisterLink>
          还没有账户？<Link href="/auth/register">立即注册</Link>
        </RegisterLink>
      </Card>
    </Container>
  );
}
