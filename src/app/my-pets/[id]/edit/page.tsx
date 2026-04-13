'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Camera, Save, Calendar, ChevronDown, Upload, X, Weight } from 'lucide-react';
import { getUserPetById, updateUserPet } from '@/lib/api/userPets';
import { petCategories } from '@/data/petNavigation';
import { compressImage, validateImageFile, convertImageToBase64 } from '@/lib/api/upload';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  font-family: var(--font-dm-sans), sans-serif;
  padding-top: 72px;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .loading-text {
    font-size: 1.25rem;
    color: #782221;
    font-family: var(--font-playfair), serif;
  }
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  z-index: 100;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C2420;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2C2420;
    margin: 0;
    font-family: var(--font-playfair), serif;
  }
  
  p {
    font-size: 0.875rem;
    color: #5D4037;
    font-family: var(--font-dm-sans), sans-serif;
  }
`;

const Main = styled.main`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Form = styled.form`
  background: #F5F2E9;
  border-radius: 0;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #2C2420;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-playfair), serif;
  
  span {
    font-size: 1.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #5D4037;
    margin-bottom: 0.5rem;
    font-family: var(--font-cinzel), serif;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    
    span.required {
      color: #782221;
    }
  }
`;

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const GenderButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.$active ? '#782221' : '#2C2420'};
  border-radius: 0;
  background: ${props => props.$active ? '#782221' : '#F5F2E9'};
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  box-shadow: ${props => props.$active ? '3px 3px 0px 0px #2C2420' : 'none'};
  
  &:hover {
    background: ${props => props.$active ? '#782221' : 'rgba(120, 34, 33, 0.05)'};
    border-color: #782221;
  }
  
  .icon {
    font-size: 1.5rem;
  }
  
  .label {
    font-size: 0.875rem;
    color: ${props => props.$active ? '#F5F2E9' : '#2C2420'};
    font-weight: 600;
    font-family: var(--font-dm-sans), sans-serif;
  }
`;

const ToggleField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border: 2px solid #2C2420;
  border-radius: 0;
  background: #F5F2E9;
  margin-bottom: 1.5rem;
  box-shadow: 3px 3px 0px 0px #2C2420;
`;

const ToggleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    background: linear-gradient(135deg, #782221, #9B2C2C);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    border: 2px solid #2C2420;
    box-shadow: 2px 2px 0px 0px #2C2420;
  }
  
  .text {
    h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #2C2420;
      margin: 0;
      font-family: var(--font-playfair), serif;
    }
    
    p {
      font-size: 0.75rem;
      color: #5D4037;
      margin: 0.25rem 0 0 0;
      font-family: var(--font-dm-sans), sans-serif;
    }
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 3.5rem;
  height: 2rem;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(44, 36, 32, 0.2);
    transition: 0.3s;
    border-radius: 0;
    border: 2px solid #2C2420;
    
    &:before {
      position: absolute;
      content: "";
      height: 1.25rem;
      width: 1.25rem;
      left: 0.2rem;
      bottom: 0.15rem;
      background-color: #F5F2E9;
      transition: 0.3s;
      border-radius: 0;
      border: 1px solid #2C2420;
    }
  }
  
  input:checked + .slider {
    background-color: #782221;
  }
  
  input:checked + .slider:before {
    transform: translateX(1.35rem);
    background-color: #F5F2E9;
  }
`;

const DatePickerField = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    border: 2px solid #2C2420;
    border-radius: 0;
    font-size: 1rem;
    color: #2C2420;
    cursor: pointer;
    background: #F5F2E9;
    font-family: var(--font-dm-sans), sans-serif;
    
    &::placeholder {
      color: #5D4037;
    }
    
    &:focus {
      outline: none;
      border-color: #782221;
      box-shadow: 3px 3px 0px 0px #782221;
    }
  }
  
  .calendar-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #C5A059;
    pointer-events: none;
  }
`;

const WeightSection = styled.div`
  background: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 3px 3px 0px 0px #2C2420;
`;

const WeightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .icon {
    color: #782221;
  }
  
  h3 {
    font-size: 1rem;
    font-weight: 700;
    color: #2C2420;
    margin: 0;
    font-family: var(--font-playfair), serif;
  }
`;

const WeightInputWrapper = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #2C2420;
    border-radius: 0;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    background: #F5F2E9;
    color: #2C2420;
    font-family: var(--font-dm-sans), sans-serif;
    
    &:focus {
      outline: none;
      border-color: #782221;
      box-shadow: 3px 3px 0px 0px #782221;
    }
  }
  
  .unit {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #5D4037;
    font-size: 1rem;
    cursor: pointer;
    font-family: var(--font-cinzel), serif;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 1rem;
  transition: all 0.3s;
  background: #F5F2E9;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
  
  &::placeholder {
    color: #5D4037;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  background: #F5F2E9 url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%232C2420" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>') no-repeat right 1rem center;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const WeightInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  
  input {
    flex: 1;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.3s;
  background: #F5F2E9;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  
  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: #782221;
    border: 2px solid #2C2420;
    border-radius: 0;
    cursor: pointer;
  }
  
  span {
    font-size: 0.875rem;
    color: #2C2420;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  
  ${props => props.$variant === 'primary' ? `
    background: #782221;
    color: #F5F2E9;
    border: 2px solid #2C2420;
    box-shadow: 3px 3px 0px 0px #2C2420;
    
    &:hover:not(:disabled) {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px 0px #2C2420;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  ` : `
    background: transparent;
    color: #2C2420;
    border: 2px solid #2C2420;
    
    &:hover {
      background: rgba(44, 36, 32, 0.05);
    }
  `}
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #F5F2E9;
  border-radius: 0;
  border: 2px solid #2C2420;
  box-shadow: 3px 3px 0px 0px #2C2420;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 8rem;
  height: 8rem;
  margin-bottom: 1rem;
`;

const AvatarImage = styled.div<{ $hasImage: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #2C2420;
  background: ${props => props.$hasImage ? 'transparent' : 'linear-gradient(135deg, #C5A059, #782221)'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: sepia(0.15) contrast(1.05);
  }
  
  svg {
    color: #F5F2E9;
  }
`;

const AvatarUploadButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0;
  background: #782221;
  border: 2px solid #2C2420;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 2px 2px 0px 0px #2C2420;
  
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px 0px #2C2420;
  }
  
  svg {
    color: #F5F2E9;
  }
`;

const RemoveAvatarButton = styled.button`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0;
  background: #2C2420;
  border: 2px solid #2C2420;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    border-color: #782221;
  }
  
  svg {
    color: #F5F2E9;
  }
`;

const AvatarHint = styled.p`
  font-size: 0.75rem;
  color: #5D4037;
  text-align: center;
  margin: 0;
  font-family: var(--font-dm-sans), sans-serif;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function EditPetPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    category: 'dog',
    custom_breed: '',
    weight: '',
    is_neutered: false
  });

  useEffect(() => {
    loadPetData();
  }, [petId]);

  // 获取可用的分类（排除热宠导航）
  const availableCategories = petCategories.filter(cat => cat.isClickable !== false);
  
  // 根据选择的分类获取品种列表
  const selectedCategoryData = petCategories.find(cat => cat.id === formData.category);
  const availableBreeds = selectedCategoryData?.breeds || [];

  const loadPetData = async () => {
    setLoading(true);
    const pet = await getUserPetById(petId);
    if (pet) {
      let category = 'dog';
      let parsedNotes = {};
      
      try {
        parsedNotes = JSON.parse(pet.notes || '{}');
        if (parsedNotes && typeof parsedNotes === 'object' && 'category' in parsedNotes) {
          category = (parsedNotes as any).category;
        }
      } catch (e) {
        // 忽略解析错误，使用默认值
      }
      
      setFormData({
        name: pet.name,
        custom_breed: pet.custom_breed || '',
        gender: pet.gender || 'unknown',
        birth_date: pet.birth_date || '',
        category: category,
        weight: pet.weight?.toString() || '',
        is_neutered: pet.is_neutered || false
      });
      
      // 加载头像
      if (pet.avatar_url) {
        setAvatarUrl(pet.avatar_url);
      }
    }
    setLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件（限制2MB，因为Base64会增大文件大小）
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let newAvatarUrl = avatarUrl;
      
      // 如果有新上传的文件，转换为Base64编码
      if (avatarFile) {
        setUploading(true);
        try {
          // 压缩图片
          const compressedFile = await compressImage(avatarFile, 600, 600, 0.7);
          // 转换为Base64编码（直接存储在数据库中）
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
      
      const updates = {
        name: formData.name,
        custom_breed: formData.custom_breed || undefined,
        gender: formData.gender,
        birth_date: formData.birth_date || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        weight_unit: 'kg' as const,
        is_neutered: formData.is_neutered,
        avatar_url: newAvatarUrl || undefined,
        notes: JSON.stringify({
          category: formData.category
        })
      };

      console.log('准备更新宠物信息:', updates);
      
      const result = await updateUserPet(petId, updates);
      
      console.log('更新结果:', result);
      
      if (result) {
        alert('宠物信息更新成功!');
        router.back();
      } else {
        alert('更新失败,请重试\n\n请检查浏览器控制台查看详细错误信息');
      }
    } catch (error) {
      console.error('更新宠物信息失败:', error);
      alert('更新失败,请重试\n\n错误: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-text">加载中...</div>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </BackButton>
        <HeaderTitle>
          <h1>编辑宠物信息</h1>
          <p>更新宠物档案信息</p>
        </HeaderTitle>
      </Header>

      <Main>
        <Form onSubmit={handleSubmit}>
          {/* 头像上传区域 */}
          <AvatarSection>
            <AvatarContainer>
              <AvatarImage $hasImage={!!avatarUrl}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="宠物头像" />
                ) : (
                  <Camera size={48} />
                )}
              </AvatarImage>
              <AvatarUploadButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload size={18} />
              </AvatarUploadButton>
              {avatarUrl && (
                <RemoveAvatarButton
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                >
                  <X size={16} />
                </RemoveAvatarButton>
              )}
            </AvatarContainer>
            <AvatarHint>
              {uploading ? '处理中...' : '点击相机图标上传宠物照片（支持 JPG、PNG、GIF、WebP，最大2MB）'}
            </AvatarHint>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
            />
          </AvatarSection>
          
          {/* 宠物昵称 */}
          <FormField>
            <label>宠物昵称</label>
            <Input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder=""
            />
          </FormField>

          {/* 分类和品种 */}
          <FormGrid>
            <FormField>
              <label>分类</label>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, custom_breed: '' })}
              >
                {availableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </FormField>

            <FormField>
              <label>品种</label>
              <Select
                value={formData.custom_breed}
                onChange={(e) => setFormData({ ...formData, custom_breed: e.target.value })}
              >
                <option value="">请选择品种</option>
                {availableBreeds.map(breed => (
                  <option key={breed.id} value={breed.name}>{breed.name}</option>
                ))}
              </Select>
            </FormField>
          </FormGrid>

          {/* 性别 */}
          <FormField>
            <label>性别</label>
            <GenderButtonGroup>
              <GenderButton
                type="button"
                $active={formData.gender === 'unknown'}
                onClick={() => setFormData({ ...formData, gender: 'unknown' })}
              >
                <span className="icon">❓</span>
                <span className="label">未知</span>
              </GenderButton>
              <GenderButton
                type="button"
                $active={formData.gender === 'male'}
                onClick={() => setFormData({ ...formData, gender: 'male' })}
              >
                <span className="icon">♂️</span>
                <span className="label">男孩</span>
              </GenderButton>
              <GenderButton
                type="button"
                $active={formData.gender === 'female'}
                onClick={() => setFormData({ ...formData, gender: 'female' })}
              >
                <span className="icon">♀️</span>
                <span className="label">女孩</span>
              </GenderButton>
            </GenderButtonGroup>
          </FormField>

          {/* 是否已绝育 */}
          <ToggleField>
            <ToggleInfo>
              <div className="icon">🩺</div>
              <div className="text">
                <h3>是否已绝育</h3>
                <p>开启后提供精准健康建议</p>
              </div>
            </ToggleInfo>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={formData.is_neutered}
                onChange={(e) => setFormData({ ...formData, is_neutered: e.target.checked })}
              />
              <span className="slider"></span>
            </ToggleSwitch>
          </ToggleField>

          {/* 出生日期 */}
          <FormField>
            <label>出生日期</label>
            <DatePickerField>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                placeholder="请选择日期"
              />
              <Calendar className="calendar-icon" size={20} />
            </DatePickerField>
          </FormField>

          {/* 体重档案 */}
          <WeightSection>
            <WeightHeader>
              <Weight className="icon" size={20} />
              <h3>体重档案</h3>
            </WeightHeader>
            <WeightInputWrapper>
              <input
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="0.00"
              />
              <div className="unit">
                kg <ChevronDown size={16} />
              </div>
            </WeightInputWrapper>
          </WeightSection>

          <ButtonGroup>
            <Button type="button" onClick={() => router.back()} disabled={saving || uploading}>
              取消
            </Button>
            <Button type="submit" disabled={saving || uploading} $variant="primary">
              <Save size={20} />
              {uploading ? '上传中...' : saving ? '保存中...' : '保存'}
            </Button>
          </ButtonGroup>
        </Form>
      </Main>
    </PageContainer>
  );
}
