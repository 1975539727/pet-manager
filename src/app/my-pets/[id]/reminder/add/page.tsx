'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Save } from 'lucide-react';
import { createHealthReminder } from '@/lib/api/healthRecords';

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

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FormField = styled.div<{ $fullWidth?: boolean }>`
  ${props => props.$fullWidth && `
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  `}
  
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
  
  p.hint {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
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
  
  &::placeholder {
    color: #9ca3af;
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

const InfoBox = styled.div`
  margin-bottom: 2rem;
  background: #eff6ff;
  border-radius: 0.5rem;
  padding: 1rem;
  
  h3 {
    font-weight: 600;
    color: #1e40af;
    margin-bottom: 0.5rem;
  }
  
  ul {
    font-size: 0.875rem;
    color: #1e40af;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    strong {
      font-weight: 600;
    }
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

export default function AddReminderPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reminder_type: 'vaccine' as 'vaccine' | 'deworming' | 'checkup' | 'medication' | 'grooming' | 'custom',
    title: '',
    description: '',
    remind_date: '',
    repeat_type: 'none' as 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly',
    repeat_interval: '1',
    advance_days: '3',
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reminderData = {
        pet_id: petId,
        reminder_type: formData.reminder_type,
        title: formData.title,
        description: formData.description || undefined,
        remind_date: formData.remind_date,
        repeat_type: formData.repeat_type,
        repeat_interval: formData.repeat_type !== 'none' ? parseInt(formData.repeat_interval) : undefined,
        advance_days: formData.advance_days ? parseInt(formData.advance_days) : undefined,
        is_completed: false,
        is_active: formData.is_active
      };

      const result = await createHealthReminder(reminderData);
      
      if (result) {
        alert('健康提醒添加成功!');
        router.back();
      } else {
        alert('添加失败,请重试');
      }
    } catch (error) {
      console.error('添加健康提醒失败:', error);
      alert('添加失败,请重试');
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
            <h1>添加健康提醒</h1>
            <p>设置疫苗、驱虫等定时提醒</p>
          </HeaderTitle>
        </HeaderContent>
      </Header>

      <Main>
        <Form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>基本信息</SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>
                  提醒类型 <span className="required">*</span>
                </label>
                <Select
                  required
                  value={formData.reminder_type}
                  onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value as any })}
                >
                  <option value="vaccine">疫苗接种</option>
                  <option value="deworming">驱虫</option>
                  <option value="checkup">健康体检</option>
                  <option value="medication">用药提醒</option>
                  <option value="grooming">美容护理</option>
                  <option value="custom">自定义</option>
                </Select>
              </FormField>

              <FormField>
                <label>
                  提醒日期 <span className="required">*</span>
                </label>
                <Input
                  type="date"
                  required
                  value={formData.remind_date}
                  onChange={(e) => setFormData({ ...formData, remind_date: e.target.value })}
                />
              </FormField>

              <FormField $fullWidth>
                <label>
                  标题 <span className="required">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如: 狂犬疫苗接种"
                />
              </FormField>

              <FormField $fullWidth>
                <label>描述</label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="添加详细描述..."
                />
              </FormField>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>重复设置</SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>重复类型</label>
                <Select
                  value={formData.repeat_type}
                  onChange={(e) => setFormData({ ...formData, repeat_type: e.target.value as any })}
                >
                  <option value="none">不重复</option>
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                  <option value="yearly">每年</option>
                </Select>
              </FormField>

              {formData.repeat_type !== 'none' && (
                <FormField>
                  <label>重复间隔</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.repeat_interval}
                    onChange={(e) => setFormData({ ...formData, repeat_interval: e.target.value })}
                  />
                  <p className="hint">
                    例如: 每2{formData.repeat_type === 'daily' ? '天' : formData.repeat_type === 'weekly' ? '周' : formData.repeat_type === 'monthly' ? '月' : '年'}
                  </p>
                </FormField>
              )}

              <FormField>
                <label>提前提醒天数</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.advance_days}
                  onChange={(e) => setFormData({ ...formData, advance_days: e.target.value })}
                />
                <p className="hint">提前几天开始提醒</p>
              </FormField>
            </FormGrid>

            <CheckboxLabel>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span>启用此提醒</span>
            </CheckboxLabel>
          </Section>

          <InfoBox>
            <h3>💡 提醒类型说明</h3>
            <ul>
              <li>• <strong>疫苗接种</strong>: 定期疫苗接种提醒(如狂犬疫苗、六联疫苗等)</li>
              <li>• <strong>驱虫</strong>: 体内外驱虫提醒</li>
              <li>• <strong>健康体检</strong>: 定期体检提醒</li>
              <li>• <strong>用药提醒</strong>: 日常用药或特殊治疗提醒</li>
              <li>• <strong>美容护理</strong>: 洗澡、剪毛、修指甲等</li>
            </ul>
          </InfoBox>

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
