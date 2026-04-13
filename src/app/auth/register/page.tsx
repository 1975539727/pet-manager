'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, User, Eye, EyeOff, Scroll } from 'lucide-react';
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
  max-width: 480px;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
  transition: all 0.3s;

  &:hover {
    box-shadow: 12px 12px 0px 0px #2C2420;
    transform: translate(-2px, -2px);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 36px;
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

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border: 2px solid ${props => props.$active || props.$completed ? '#782221' : '#2C2420'};
  background: ${props => props.$active ? '#782221' : props.$completed ? '#C5A059' : 'transparent'};
  color: ${props => props.$active || props.$completed ? '#F5F2E9' : '#2C2420'};
  font-family: var(--font-cinzel), serif;
  transition: all 0.3s;
`;

const StepLine = styled.div<{ $active: boolean }>`
  width: 40px;
  height: 2px;
  background: ${props => props.$active ? '#782221' : 'rgba(44, 36, 32, 0.2)'};
  transition: all 0.3s;
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

const CodeInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CodeInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 16px;
  text-align: center;
  font-weight: 600;
  letter-spacing: 2px;
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
    letter-spacing: normal;
    font-weight: 400;
  }
`;

const SendCodeButton = styled.button`
  padding: 14px 20px;
  background: transparent;
  border: 2px solid #2C2420;
  border-radius: 0;
  color: #782221;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-cinzel), serif;
  box-shadow: 3px 3px 0px 0px #2C2420;

  &:hover:not(:disabled) {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0px 0px #2C2420;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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

const LoginLink = styled.div`
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
          <Title>注册爪爪管家</Title>
          <Subtitle>
            {step === 'email' ? '请输入邮箱并获取验证码' : '完善个人信息'}
          </Subtitle>
        </Header>

        <StepIndicator>
          <StepDot $active={step === 'email'} $completed={step === 'info'}>1</StepDot>
          <StepLine $active={step === 'info'} />
          <StepDot $active={step === 'info'} $completed={false}>2</StepDot>
        </StepIndicator>

        <Divider><span>{step === 'email' ? 'Email Verify' : 'Profile Setup'}</span></Divider>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <Form onSubmit={handleSubmit}>
          {step === 'email' ? (
            <>
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
                <InputLabel>验证码</InputLabel>
                <CodeInputGroup>
                  <CodeInput
                    type="text"
                    placeholder="6位验证码"
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
              </div>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? '验证中...' : '验证邮箱'}
              </SubmitButton>
            </>
          ) : (
            <>
              <div>
                <InputLabel>用户名（可选）</InputLabel>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="请输入用户名"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                  />
                  <InputIcon>
                    <User size={20} />
                  </InputIcon>
                </InputGroup>
              </div>

              <div>
                <InputLabel>真实姓名（可选）</InputLabel>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="请输入真实姓名"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                  <InputIcon>
                    <User size={20} />
                  </InputIcon>
                </InputGroup>
              </div>

              <div>
                <InputLabel>设置密码</InputLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="密码至少6位"
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

              <div>
                <InputLabel>确认密码</InputLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="请再次输入密码"
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
              </div>

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
