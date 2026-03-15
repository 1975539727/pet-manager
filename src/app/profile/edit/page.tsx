'use client';

import styled from 'styled-components';
import { User, Upload, Users, Calendar, Camera, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { compressImage, validateImageFile, convertImageToBase64 } from '@/lib/api/upload';

const Container = styled.div`
  width: 100%;
  padding: 0;
  background: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const Content = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const AvatarSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div<{ $hasImage: boolean }>`
  width: 4.5rem;
  height: 4.5rem;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #fecaca 0%, #fca5a5 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarIcon = styled.div`
  font-size: 1.75rem;
  color: #f87171;
`;

const UploadButton = styled.button`
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #6d28d9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RemoveAvatarButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
  
  &:hover {
    background: #dc2626;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding: 0 0 0 1rem;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  border: 2px solid #000;
  padding: 1.5rem;
`;

const FormItem = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: #7c3aed;
  border-radius: 0.5rem;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 4.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 4.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 4.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #1f2937;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  
  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const SaveButton = styled.button`
  width: 100%;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 2px solid #000;
  
  &:hover {
    background: #6d28d9;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  background: white;
  color: #1f2937;
  border: 2px solid #000;
  border-radius: 1rem;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
`;

interface User {
  id: string;
  username?: string;
  full_name?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  gender?: string;
  birth_date?: string;
  is_email_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  last_login_at?: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nickname: '',
    bio: '',
    gender: '男',
    birthDate: ''
  });

  useEffect(() => {
    // 从 localStorage 读取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          nickname: userData.username || userData.full_name || '',
          bio: userData.bio || '',
          gender: userData.gender || '男',
          birthDate: userData.birth_date || ''
        });
        // 加载头像
        if (userData.avatar_url) {
          setAvatarUrl(userData.avatar_url);
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件（限制2MB）
    const validation = validateImageFile(file, 2 * 1024 * 1024);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setAvatarFile(file);
    
    // 预览图片
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      let newAvatarUrl = avatarUrl;
      
      // 如果有新上传的文件，转换为Base64编码
      if (avatarFile) {
        setUploading(true);
        try {
          // 压缩图片
          const compressedFile = await compressImage(avatarFile, 400, 400, 0.7);
          // 转换为Base64编码
          const base64String = await convertImageToBase64(compressedFile);
          newAvatarUrl = base64String;
        } catch (error) {
          console.error('图片处理错误:', error);
          alert('图片处理失败');
          setSaving(false);
          setUploading(false);
          return;
        } finally {
          setUploading(false);
        }
      }
      
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          username: formData.nickname,
          bio: formData.bio,
          gender: formData.gender,
          birth_date: formData.birthDate || null,
          avatar_url: newAvatarUrl || undefined
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 更新 localStorage 中的用户信息
        const updatedUser = result.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 触发自定义事件，通知其他组件用户信息已更新
        window.dispatchEvent(new Event('userProfileUpdated'));
        
        // 返回上一页
        router.back();
      } else {
        alert(result.message || '更新失败，请稍后再试');
      }
    } catch (error) {
      console.error('更新用户资料失败:', error);
      alert('更新失败，请稍后再试');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading || !user) {
    return (
      <Container>
        <Header>
          <Title>编辑资料</Title>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>编辑资料</Title>
      </Header>

      <Content>
        {/* 头像上传 */}
        <AvatarSection>
          <Avatar $hasImage={!!avatarUrl}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="用户头像" />
            ) : (
              <AvatarIcon>
                <User size={28} />
              </AvatarIcon>
            )}
          </Avatar>
          <ButtonWrapper>
            <UploadButton
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera size={18} />
              {uploading ? '上传中...' : '上传头像'}
            </UploadButton>
            {avatarUrl && (
              <RemoveAvatarButton
                type="button"
                onClick={handleRemoveAvatar}
                disabled={uploading}
              >
                <X size={18} />
                删除
              </RemoveAvatarButton>
            )}
          </ButtonWrapper>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
          />
        </AvatarSection>

        {/* 基本信息 */}
        <Section>
          <SectionTitle>基本信息</SectionTitle>
          <FormCard>
            <FormItem>
              <FormLabel>昵称</FormLabel>
              <InputWrapper>
                <IconWrapper>
                  <Upload size={20} />
                </IconWrapper>
                <Input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  maxLength={64}
                />
              </InputWrapper>
              <CharCount>{formData.nickname.length}/64</CharCount>
            </FormItem>

            <FormItem>
              <FormLabel>个人简介</FormLabel>
              <InputWrapper>
                <IconWrapper style={{ alignItems: 'flex-start', paddingTop: '0.75rem' }}>
                  <User size={20} />
                </IconWrapper>
                <TextArea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="个人简介"
                  maxLength={255}
                />
              </InputWrapper>
              <CharCount>{formData.bio.length}/255</CharCount>
            </FormItem>

            <FormItem>
              <FormLabel>性别</FormLabel>
              <InputWrapper>
                <IconWrapper>
                  <Users size={20} />
                </IconWrapper>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </Select>
              </InputWrapper>
            </FormItem>

            <FormItem>
              <FormLabel>出生日期</FormLabel>
              <InputWrapper>
                <IconWrapper>
                  <Calendar size={20} />
                </IconWrapper>
                <Input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  placeholder="未设置"
                />
              </InputWrapper>
            </FormItem>
          </FormCard>
        </Section>

        {/* 按钮组 */}
        <ButtonGroup>
          <SaveButton onClick={handleSave} disabled={saving || uploading}>
            💾 {uploading ? '上传中...' : saving ? '保存中...' : '保存资料'}
          </SaveButton>
          <CancelButton onClick={handleCancel}>
            取消
          </CancelButton>
        </ButtonGroup>
      </Content>
    </Container>
  );
}
