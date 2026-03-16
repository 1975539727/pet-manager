'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

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
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
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

const SecondaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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

const CodeTimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -8px;
  padding: 0 4px;
`;

const TimerText = styled.span`
  color: #666;
  font-size: 14px;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    color: #999;
    cursor: not-allowed;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
`;

const StepDot = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => 
    props.$completed ? '#667eea' : 
    props.$active ? '#667eea' : '#e0e0e0'};
  transition: all 0.2s;
`;

const BackLink = styled.div`
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

type Step = 'email' | 'verify' | 'reset';

interface FormData {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [countdown, setCountdown] = useState(0);

  // 倒计时逻辑
  const startCountdown = () => {
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
  };

  // 发送验证码
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !/^\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: '请输入有效邮箱地址' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          codeType: 'password_reset'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setCurrentStep('verify');
        startCountdown();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '发送失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  // 重新发送验证码
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          codeType: 'password_reset'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '验证码已重新发送' });
        startCountdown();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '发送失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !/^\d{6}$/.test(formData.code)) {
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
          code: formData.code,
          codeType: 'password_reset'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '验证成功，请设置新密码' });
        setCurrentStep('reset');
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '验证失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  // 重置密码
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || formData.password.length < 6) {
      setMessage({ type: 'error', text: '密码长度至少6位' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '密码重置成功，即将跳转到登录页面' });
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '重置失败，请稍后再试' });
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
      <BackButton href="/auth/login">
        <ArrowLeft size={20} />
        返回登录
      </BackButton>

      <Card>
        <Header>
          <Logo>🔑</Logo>
          <Title>找回密码</Title>
          <Subtitle>
            {currentStep === 'email' && '请输入您的注册邮箱'}
            {currentStep === 'verify' && '请输入邮箱验证码'}
            {currentStep === 'reset' && '请设置新密码'}
          </Subtitle>
        </Header>

        <StepIndicator>
          <StepDot $active={currentStep === 'email'} $completed={currentStep !== 'email'} />
          <StepDot $active={currentStep === 'verify'} $completed={currentStep === 'reset'} />
          <StepDot $active={currentStep === 'reset'} $completed={false} />
        </StepIndicator>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        {/* 步骤1：输入邮箱 */}
        {currentStep === 'email' && (
          <Form onSubmit={handleSendCode}>
            <InputGroup>
              <Input
                type="email"
                placeholder="请输入注册邮箱"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <InputIcon>
                <Mail size={20} />
              </InputIcon>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '发送中...' : '发送验证码'}
            </SubmitButton>
          </Form>
        )}

        {/* 步骤2：验证验证码 */}
        {currentStep === 'verify' && (
          <Form onSubmit={handleVerifyCode}>
            <InputGroup>
              <Input
                type="text"
                placeholder="请输入6位验证码"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
              <InputIcon>
                <KeyRound size={20} />
              </InputIcon>
            </InputGroup>

            <CodeTimer>
              <TimerText>
                {countdown > 0 ? `${countdown}秒后可重新发送` : '未收到验证码？'}
              </TimerText>
              <ResendButton
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || loading}
              >
                重新发送
              </ResendButton>
            </CodeTimer>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '验证中...' : '验证'}
            </SubmitButton>

            <SecondaryButton type="button" onClick={() => setCurrentStep('email')}>
              返回上一步
            </SecondaryButton>
          </Form>
        )}

        {/* 步骤3：重置密码 */}
        {currentStep === 'reset' && (
          <Form onSubmit={handleResetPassword}>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入新密码"
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
                placeholder="请再次输入新密码"
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
              {loading ? '重置中...' : '重置密码'}
            </SubmitButton>
          </Form>
        )}

        <BackLink>
          记起密码了？<Link href="/auth/login">立即登录</Link>
        </BackLink>
      </Card>
    </Container>
  );
}
