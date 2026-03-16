'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const Container = styled.div`
  min-height: 100vh;
  background: #f9fafb;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2937;
  margin-right: 1rem;
  
  &:hover {
    background: #f3f4f6;
    border-radius: 0.375rem;
  }
`;

const Title = styled.h1`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #667eea;
  }
`;

const HelperText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: #5568d3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
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

const TipCard = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const TipTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipList = styled.ul`
  margin: 0;
  padding-left: 1.25rem;
  color: #1e40af;
  font-size: 0.75rem;
  line-height: 1.6;
`;

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface User {
  id: string;
  email: string;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // 检查用户登录状态
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/auth/login');
      return;
    }
    
    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证当前密码
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: '请输入当前密码' });
      return;
    }

    // 验证新密码
    if (!formData.newPassword || formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度至少6位' });
      return;
    }

    // 验证密码一致性
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的新密码不一致' });
      return;
    }

    // 检查新旧密码是否相同
    if (formData.currentPassword === formData.newPassword) {
      setMessage({ type: 'error', text: '新密码不能与当前密码相同' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: '密码修改成功' });
        // 清空表单
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // 2秒后返回设置页面
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '修改失败，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </BackButton>
        <Title>修改密码</Title>
      </Header>

      <Content>
        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <Card>
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>当前密码</Label>
              <InputWrapper>
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="请输入当前密码"
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>新密码</Label>
              <InputWrapper>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="请输入新密码（至少6位）"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
              <HelperText>建议使用字母、数字和符号的组合</HelperText>
            </InputGroup>

            <InputGroup>
              <Label>确认新密码</Label>
              <InputWrapper>
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
              </InputWrapper>
            </InputGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? '修改中...' : '确认修改'}
            </SubmitButton>
          </Form>
        </Card>

        <TipCard>
          <TipTitle>
            <Lock size={16} />
            密码安全提示
          </TipTitle>
          <TipList>
            <li>密码长度至少6位，建议使用8位以上</li>
            <li>包含大小写字母、数字和特殊符号更安全</li>
            <li>不要使用生日、电话等容易被猜到的密码</li>
            <li>定期更换密码以保护账户安全</li>
          </TipList>
        </TipCard>
      </Content>
    </Container>
  );
}
