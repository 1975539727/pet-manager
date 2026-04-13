'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Eye, EyeOff, KeyRound } from 'lucide-react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

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
    background: linear-gradient(135deg, #C5A059, #D4AF37);
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

const SecondaryButton = styled.button`
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #2C2420;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: var(--font-cinzel), serif;

  &:hover:not(:disabled) {
    background: rgba(44, 36, 32, 0.05);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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

const CodeTimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -8px;
  padding: 0 4px;
`;

const TimerText = styled.span`
  color: #5D4037;
  font-size: 14px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #782221;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-cinzel), serif;
  transition: color 0.3s;

  &:hover:not(:disabled) {
    color: #9B2C2C;
  }

  &:disabled {
    color: #aaa;
    cursor: not-allowed;
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
  width: 32px;
  height: 2px;
  background: ${props => props.$active ? '#782221' : 'rgba(44, 36, 32, 0.2)'};
  transition: all 0.3s;
`;

const BackLink = styled.div`
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
        <ArrowLeft size={18} />
        返回登录
      </BackButton>

      <Card>
        <Header>
          <LogoIcon>
            <div className="logo-wrapper">
              <KeyRound size={32} />
            </div>
          </LogoIcon>
          <Title>找回密码</Title>
          <Subtitle>
            {currentStep === 'email' && '请输入您的注册邮箱'}
            {currentStep === 'verify' && '请输入邮箱验证码'}
            {currentStep === 'reset' && '请设置新密码'}
          </Subtitle>
        </Header>

        <StepIndicator>
          <StepDot $active={currentStep === 'email'} $completed={currentStep !== 'email'}>1</StepDot>
          <StepLine $active={currentStep === 'verify' || currentStep === 'reset'} />
          <StepDot $active={currentStep === 'verify'} $completed={currentStep === 'reset'}>2</StepDot>
          <StepLine $active={currentStep === 'reset'} />
          <StepDot $active={currentStep === 'reset'} $completed={false}>3</StepDot>
        </StepIndicator>

        <Divider>
          <span>
            {currentStep === 'email' && 'Enter Email'}
            {currentStep === 'verify' && 'Verify Code'}
            {currentStep === 'reset' && 'New Password'}
          </span>
        </Divider>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        {/* 步骤1：输入邮箱 */}
        {currentStep === 'email' && (
          <Form onSubmit={handleSendCode}>
            <div>
              <InputLabel>注册邮箱</InputLabel>
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
            </div>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '发送中...' : '发送验证码'}
            </SubmitButton>
          </Form>
        )}

        {/* 步骤2：验证验证码 */}
        {currentStep === 'verify' && (
          <Form onSubmit={handleVerifyCode}>
            <div>
              <InputLabel>验证码</InputLabel>
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
            </div>

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
            <div>
              <InputLabel>新密码</InputLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入新密码（至少6位）"
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
              <InputLabel>确认新密码</InputLabel>
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
            </div>

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
