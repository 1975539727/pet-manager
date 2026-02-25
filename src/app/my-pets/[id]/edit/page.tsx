'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Save } from 'lucide-react';
import { getUserPetById, updateUserPet } from '@/lib/api/userPets';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .loading-text {
    font-size: 1.25rem;
    color: #ea580c;
  }
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
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
    
    span.required {
      color: #ef4444;
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    ring: 2px solid #f97316;
    border-color: transparent;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    ring: 2px solid #f97316;
    border-color: transparent;
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

export default function EditPetPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    custom_breed: '',
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    birth_date: '',
    color: '',
    weight: '',
    weight_unit: 'kg' as 'kg' | 'lb',
    chip_number: '',
    registration_number: '',
    adoption_date: '',
    source: '',
    is_neutered: false,
    notes: ''
  });

  useEffect(() => {
    loadPetData();
  }, [petId]);

  const loadPetData = async () => {
    setLoading(true);
    const pet = await getUserPetById(petId);
    if (pet) {
      setFormData({
        name: pet.name,
        custom_breed: pet.custom_breed || '',
        gender: pet.gender || 'unknown',
        birth_date: pet.birth_date || '',
        color: pet.color || '',
        weight: pet.weight?.toString() || '',
        weight_unit: pet.weight_unit || 'kg',
        chip_number: pet.chip_number || '',
        registration_number: pet.registration_number || '',
        adoption_date: pet.adoption_date || '',
        source: pet.source || '',
        is_neutered: pet.is_neutered || false,
        notes: pet.notes || ''
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = {
        name: formData.name,
        custom_breed: formData.custom_breed || undefined,
        gender: formData.gender,
        birth_date: formData.birth_date || undefined,
        color: formData.color || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        weight_unit: formData.weight_unit,
        chip_number: formData.chip_number || undefined,
        registration_number: formData.registration_number || undefined,
        adoption_date: formData.adoption_date || undefined,
        source: formData.source || undefined,
        is_neutered: formData.is_neutered,
        notes: formData.notes || undefined
      };

      const result = await updateUserPet(petId, updates);
      
      if (result) {
        alert('宠物信息更新成功!');
        router.back();
      } else {
        alert('更新失败,请重试');
      }
    } catch (error) {
      console.error('更新宠物信息失败:', error);
      alert('更新失败,请重试');
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
        <HeaderContent>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={24} />
          </BackButton>
          <HeaderTitle>
            <h1>编辑宠物信息</h1>
            <p>更新宠物档案信息</p>
          </HeaderTitle>
        </HeaderContent>
      </Header>

      <Main>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>
              <span>📝</span>
              基本信息
            </SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>
                  宠物名字 <span className="required">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormField>

              <FormField>
                <label>品种</label>
                <Input
                  type="text"
                  value={formData.custom_breed}
                  onChange={(e) => setFormData({ ...formData, custom_breed: e.target.value })}
                />
              </FormField>

              <FormField>
                <label>性别</label>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                >
                  <option value="unknown">未知</option>
                  <option value="male">雄性 ♂</option>
                  <option value="female">雌性 ♀</option>
                </Select>
              </FormField>

              <FormField>
                <label>出生日期</label>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                />
              </FormField>

              <FormField>
                <label>毛色</label>
                <Input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </FormField>

              <FormField>
                <label>体重</label>
                <WeightInputGroup>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                  <Select
                    value={formData.weight_unit}
                    onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value as any })}
                  >
                    <option value="kg">公斤</option>
                    <option value="lb">磅</option>
                  </Select>
                </WeightInputGroup>
              </FormField>
            </FormGrid>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.is_neutered}
                onChange={(e) => setFormData({ ...formData, is_neutered: e.target.checked })}
              />
              <span>已绝育</span>
            </CheckboxLabel>
          </Section>

          <Section>
            <SectionTitle>
              <span>🏷️</span>
              识别信息
            </SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>芯片号码</label>
                <Input
                  type="text"
                  value={formData.chip_number}
                  onChange={(e) => setFormData({ ...formData, chip_number: e.target.value })}
                />
              </FormField>

              <FormField>
                <label>注册号码</label>
                <Input
                  type="text"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                />
              </FormField>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>
              <span>🏠</span>
              领养信息
            </SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>领养日期</label>
                <Input
                  type="date"
                  value={formData.adoption_date}
                  onChange={(e) => setFormData({ ...formData, adoption_date: e.target.value })}
                />
              </FormField>

              <FormField>
                <label>来源</label>
                <Input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </FormField>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>
              <span>📄</span>
              备注
            </SectionTitle>
            
            <TextArea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </Section>

          <ButtonGroup>
            <Button type="button" onClick={() => router.back()}>
              取消
            </Button>
            <Button type="submit" disabled={saving} $variant="primary">
              <Save size={20} />
              {saving ? '保存中...' : '保存'}
            </Button>
          </ButtonGroup>
        </Form>
      </Main>
    </PageContainer>
  );
}
