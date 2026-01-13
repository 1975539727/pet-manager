'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const Logo = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 48px 16px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #667eea;
  }
`;

const CodeInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CodeInput = styled.input`
  flex: 1;
  padding: 16px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  font-size: 16px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 2px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SendCodeButton = styled.button`
  padding: 16px 24px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #666;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 500;
  
  ${props => props.type === 'success' && `
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  `}
  
  ${props => props.type === 'error' && `
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
`;

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullName: string;
  verificationCode: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    verificationCode: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [step, setStep] = useState<'email' | 'info'>('email');

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.email || !/^\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: '请输入有效邮箱地址' });
      return;
    }

    setSendingCode(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          codeType: 'registration'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        
        // 开发环境显示验证码
        if (result.code) {
          console.log('验证码（仅开发环境显示）:', result.code);
        }

        // 开始倒计时
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '发送验证码失败，请稍后再试' });
    } finally {
      setSendingCode(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    if (!formData.verificationCode || !/^\d{6}$/.test(formData.verificationCode)) {
      setMessage({ type: 'error', text: '请输入6位数字验证码' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: formData.verificationCode,
          codeType: 'registration'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '验证码验证成功！' });
        setStep('info');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '验证失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  // 提交注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'email') {
      await handleVerifyCode();
      return;
    }

    // 验证表单
    if (!formData.password || formData.password.length < 6) {
      setMessage({ type: 'error', text: '密码长度至少6位' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: '两次密码输入不一致' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          full_name: formData.fullName,
          verification_code: formData.verificationCode
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '注册成功！正在跳转到登录页...' });
        setTimeout(() => {
          window.location.href = '/auth/login';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '注册失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  return (
    <Container>
      <BackButton href="/">
        <ArrowLeft size={20} />
        返回首页
      </BackButton>

      <Card>
        <Header>
          <Logo>🐾</Logo>
          <Title>注册爪爪管家</Title>
          <Subtitle>
            {step === 'email' ? '请输入邮箱并获取验证码' : '完善个人信息'}
          </Subtitle>
        </Header>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <Form onSubmit={handleSubmit}>
          {step === 'email' ? (
            <>
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

              <CodeInputGroup>
                <CodeInput
                  type="text"
                  placeholder="验证码"
                  maxLength={6}
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value.replace(/\D/g, ''))}
                  required
                />
                <SendCodeButton
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                >
                  {sendingCode ? '发送中...' : countdown > 0 ? `${countdown}s` : '获取验证码'}
                </SendCodeButton>
              </CodeInputGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? '验证中...' : '验证邮箱'}
              </SubmitButton>
            </>
          ) : (
            <>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="用户名（可选）"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                />
                <InputIcon>
                  <User size={20} />
                </InputIcon>
              </InputGroup>

              <InputGroup>
                <Input
                  type="text"
                  placeholder="真实姓名（可选）"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                <InputIcon>
                  <User size={20} />
                </InputIcon>
              </InputGroup>

              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="设置密码（至少6位）"
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

              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="确认密码"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? '注册中...' : '完成注册'}
              </SubmitButton>
            </>
          )}
        </Form>

        <LoginLink>
          已有账户？<Link href="/auth/login">立即登录</Link>
        </LoginLink>
      </Card>
    </Container>
  );
}
