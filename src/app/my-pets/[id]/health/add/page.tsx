'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Save } from 'lucide-react';
import { createHealthRecord } from '@/lib/api/healthRecords';

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

const CostInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  
  input {
    flex: 1;
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

export default function AddHealthRecordPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    record_type: 'vaccine' as 'vaccine' | 'deworming' | 'checkup' | 'illness' | 'surgery' | 'other',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    veterinarian: '',
    clinic: '',
    diagnosis: '',
    treatment: '',
    medication: '',
    vaccine_name: '',
    next_due_date: '',
    cost: '',
    cost_currency: 'CNY'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const recordData = {
        pet_id: petId,
        record_type: formData.record_type,
        title: formData.title,
        description: formData.description || undefined,
        date: formData.date,
        veterinarian: formData.veterinarian || undefined,
        clinic: formData.clinic || undefined,
        diagnosis: formData.diagnosis || undefined,
        treatment: formData.treatment || undefined,
        medication: formData.medication || undefined,
        vaccine_name: formData.vaccine_name || undefined,
        next_due_date: formData.next_due_date || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        cost_currency: formData.cost ? formData.cost_currency : undefined
      };

      const result = await createHealthRecord(recordData);
      
      if (result) {
        alert('健康记录添加成功!');
        router.back();
      } else {
        alert('添加失败,请重试');
      }
    } catch (error) {
      console.error('添加健康记录失败:', error);
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
            <h1>添加健康记录</h1>
            <p>记录宠物的健康信息</p>
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
                  记录类型 <span className="required">*</span>
                </label>
                <Select
                  required
                  value={formData.record_type}
                  onChange={(e) => setFormData({ ...formData, record_type: e.target.value as any })}
                >
                  <option value="vaccine">疫苗接种</option>
                  <option value="deworming">驱虫</option>
                  <option value="checkup">健康体检</option>
                  <option value="illness">疾病治疗</option>
                  <option value="surgery">手术</option>
                  <option value="other">其他</option>
                </Select>
              </FormField>

              <FormField>
                <label>
                  日期 <span className="required">*</span>
                </label>
                <Input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
            <SectionTitle>医疗信息</SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>兽医</label>
                <Input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  placeholder="兽医姓名"
                />
              </FormField>

              <FormField>
                <label>诊所/医院</label>
                <Input
                  type="text"
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                  placeholder="医疗机构名称"
                />
              </FormField>

              {(formData.record_type === 'illness' || formData.record_type === 'surgery') && (
                <>
                  <FormField $fullWidth>
                    <label>诊断</label>
                    <TextArea
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      rows={2}
                      placeholder="诊断结果..."
                    />
                  </FormField>

                  <FormField $fullWidth>
                    <label>治疗方案</label>
                    <TextArea
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      rows={2}
                      placeholder="治疗方案..."
                    />
                  </FormField>

                  <FormField $fullWidth>
                    <label>用药</label>
                    <Input
                      type="text"
                      value={formData.medication}
                      onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                      placeholder="处方药物..."
                    />
                  </FormField>
                </>
              )}

              {formData.record_type === 'vaccine' && (
                <>
                  <FormField>
                    <label>疫苗名称</label>
                    <Input
                      type="text"
                      value={formData.vaccine_name}
                      onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                      placeholder="例如: 狂犬疫苗"
                    />
                  </FormField>

                  <FormField>
                    <label>下次接种日期</label>
                    <Input
                      type="date"
                      value={formData.next_due_date}
                      onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                    />
                  </FormField>
                </>
              )}

              {formData.record_type === 'deworming' && (
                <FormField>
                  <label>下次驱虫日期</label>
                  <Input
                    type="date"
                    value={formData.next_due_date}
                    onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
                  />
                </FormField>
              )}
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>费用信息</SectionTitle>
            
            <FormGrid>
              <FormField>
                <label>费用</label>
                <CostInputGroup>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    placeholder="金额"
                  />
                  <Select
                    value={formData.cost_currency}
                    onChange={(e) => setFormData({ ...formData, cost_currency: e.target.value })}
                  >
                    <option value="CNY">¥</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </Select>
                </CostInputGroup>
              </FormField>
            </FormGrid>
          </Section>

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
