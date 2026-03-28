'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Camera, Save, Calendar, ChevronDown } from 'lucide-react';
import { createUserPet } from '@/lib/api/userPets';
import { petCategories } from '@/data/petNavigation';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
`;

const Header = styled.header`
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
  
  svg {
    color: #374151;
  }
`;

const HeaderTitle = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ea580c;
  }
  
  p {
    font-size: 0.875rem;
    color: #4b5563;
  }
`;

const Main = styled.main`
  max-width: 64rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Form = styled.form`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const AvatarUpload = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

const AvatarCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid #e5e7eb;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    color: #9ca3af;
  }
`;

const CameraButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid white;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  svg {
    color: white;
  }
  
  input {
    display: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
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
    font-weight: 500;
    color: #9ca3af;
    margin-bottom: 0.5rem;
    
    span.required {
      color: #ef4444;
    }
  }
`;

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const GenderButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${props => props.$active ? '#3b82f6' : '#e5e7eb'};
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    border-color: #3b82f6;
  }
  
  .icon {
    font-size: 1.5rem;
  }
  
  .label {
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
  }
`;

const ToggleField = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  margin-bottom: 1.5rem;
`;

const ToggleInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon {
    width: 2.5rem;
    height: 2.5rem;
    background: #f3f4f6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
  }
  
  .text {
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    
    p {
      font-size: 0.75rem;
      color: #9ca3af;
      margin: 0.25rem 0 0 0;
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
    background-color: #e5e7eb;
    transition: 0.3s;
    border-radius: 2rem;
    
    &:before {
      position: absolute;
      content: "";
      height: 1.5rem;
      width: 1.5rem;
      left: 0.25rem;
      bottom: 0.25rem;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
  
  input:checked + .slider {
    background-color: #3b82f6;
  }
  
  input:checked + .slider:before {
    transform: translateX(1.5rem);
  }
`;

const DatePickerField = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 1rem 3rem 1rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1rem;
    color: #1f2937;
    cursor: pointer;
    
    &::placeholder {
      color: #9ca3af;
    }
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
    }
  }
  
  .calendar-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #fbbf24;
    pointer-events: none;
  }
`;

const WeightSection = styled.div`
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const WeightHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .icon {
    color: #a855f7;
  }
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
`;

const WeightInputWrapper = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    background: white;
    
    &:focus {
      outline: none;
      border-color: #a855f7;
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
    color: #9ca3af;
    font-size: 1rem;
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  appearance: none;
  background: white url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>') no-repeat right 1rem center;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
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
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    ring: 2px solid #f97316;
    border-color: transparent;
  }
  
  &::placeholder {
    color: #9ca3af;
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
    color: #f97316;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  
  span {
    font-size: 0.875rem;
    color: #374151;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => props.$variant === 'primary' ? `
    background: #f97316;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background: #ea580c;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  ` : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
    }
  `}
`;

export default function AddPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    category: 'dog',
    custom_breed: '',
    weight: '',
    is_neutered: false
  });

  // 获取可用的分类（排除热宠导航）
  const availableCategories = petCategories.filter(cat => cat.isClickable !== false);
  
  // 根据选择的分类获取品种列表
  const selectedCategoryData = petCategories.find(cat => cat.id === formData.category);
  const availableBreeds = selectedCategoryData?.breeds || [];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(user);
      
      const petData = {
        user_id: userData.id,
        name: formData.name,
        custom_breed: formData.custom_breed || undefined,
        gender: formData.gender,
        birth_date: formData.birth_date || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        weight_unit: 'kg' as const,
        status: 'active' as const,
        is_neutered: formData.is_neutered,
        notes: JSON.stringify({
          category: formData.category
        })
      };

      const result = await createUserPet(petData);
      
      if (result) {
        alert('宠物档案创建成功!');
        router.push('/my-pets');
      } else {
        alert('创建失败,请重试');
      }
    } catch (error) {
      console.error('创建宠物档案失败:', error);
      alert('创建失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </BackButton>
          <HeaderTitle>
            <h1>创建宠物档案</h1>
            <p>让我们了解一下你的小伙伴吧!</p>
          </HeaderTitle>
        </HeaderContent>
      </Header>

      <Main>
        <Form onSubmit={handleSubmit}>
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
              <Camera className="icon" size={20} />
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
            <Button type="button" onClick={() => router.back()}>
              取消
            </Button>
            <Button type="submit" disabled={loading} $variant="primary">
              <Save size={20} />
              {loading ? '保存中...' : '保存'}
            </Button>
          </ButtonGroup>
        </Form>
      </Main>
    </PageContainer>
  );
}
