'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Plus, ArrowLeft, Pill, Calendar, Clock, X, CheckCircle, MoreVertical, Check, Trash2 } from 'lucide-react';
import { getUserPets } from '@/lib/api/userPets';
import { UserPet } from '@/lib/supabase';
import {
  createMedication,
  getPendingMedications,
  getCompletedMedications,
  completeMedication,
  deleteMedication,
  PetMedication,
  RepeatType
} from '@/lib/api/petMedications';

// ============================================
// 样式组件（neo-brutalist 风格）
// ============================================

const PageContainer = styled.div`
  min-height: 100vh;
  padding-top: 96px;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const Header = styled.div`
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const AddButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const TabContainer = styled.div`
  background: rgba(245, 242, 233, 0.95);
  display: flex;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const Tab = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  color: ${props => props.$active ? '#782221' : '#5D4037'};
  border-bottom: ${props => props.$active ? '3px solid #782221' : '3px solid transparent'};
  transition: all 0.2s;
  font-weight: ${props => props.$active ? '700' : '400'};
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  
  &:hover {
    color: #782221;
  }
`;

const ContentContainer = styled.div`
  padding: 2rem 1rem;
`;

const EmptyState = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 4rem 2rem;
  text-align: center;
  max-width: 60rem;
  margin: 0 auto;
  border: 3px solid #2C2420;
  box-shadow: 6px 6px 0px 0px #2C2420;
  
  .icon-wrapper {
    width: 5rem;
    height: 5rem;
    background: linear-gradient(135deg, #782221, #9B2C2C);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    border: 2px solid #2C2420;
    box-shadow: 3px 3px 0px 0px #2C2420;
    
    svg {
      color: #F5F2E9;
    }
  }
  
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #2C2420;
    margin-bottom: 0.5rem;
    font-family: var(--font-playfair), serif;
  }
  
  p {
    font-size: 0.875rem;
    color: #5D4037;
    font-family: var(--font-dm-sans), sans-serif;
  }
`;

// ============================================
// 弹窗样式
// ============================================

const ModalOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(44, 36, 32, 0.6);
  display: ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 2rem;
  max-width: 32rem;
  width: 100%;
  border: 3px solid #2C2420;
  box-shadow: 8px 8px 0px 0px #2C2420;
  max-height: 90vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 0.5rem;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(44, 36, 32, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: #5D4037;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  .left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .icon {
    width: 3rem;
    height: 3rem;
    background: linear-gradient(135deg, #782221, #9B2C2C);
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    border: 2px solid #2C2420;
    box-shadow: 2px 2px 0px 0px #2C2420;
  }
  
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #2C2420;
    margin: 0;
    font-family: var(--font-playfair), serif;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: 2px solid #2C2420;
  cursor: pointer;
  color: #2C2420;
  padding: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  transition: all 0.3s;
  
  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  
  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2C2420;
    margin-bottom: 0.5rem;
    font-family: var(--font-playfair), serif;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  transition: all 0.2s;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  box-sizing: border-box;
  
  &::placeholder {
    color: #aaa;
  }
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const DosageRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const DosageInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  transition: all 0.2s;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  box-sizing: border-box;
  
  &::placeholder {
    color: #aaa;
  }
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const UnitSelect = styled.select`
  width: 7rem;
  padding: 0.875rem 0.75rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  color: #2C2420;
  cursor: pointer;
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232C2420' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const DateInputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #782221;
    pointer-events: none;
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 3rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const TimeInputWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #782221;
    pointer-events: none;
  }
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  padding-left: 3rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  color: #2C2420;
  font-family: var(--font-dm-sans), sans-serif;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const RepeatGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RepeatButton = styled.button<{ $active?: boolean }>`
  padding: 0.625rem 1rem;
  border: 2px solid #2C2420;
  border-radius: 0;
  font-size: 0.813rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-dm-sans), sans-serif;
  
  ${props => props.$active ? `
    background: #782221;
    color: #F5F2E9;
    box-shadow: 2px 2px 0px 0px #2C2420;
  ` : `
    background: white;
    color: #2C2420;
    
    &:hover {
      background: rgba(120, 34, 33, 0.05);
    }
  `}
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  background: white;
  font-size: 0.875rem;
  min-height: 5rem;
  resize: vertical;
  font-family: var(--font-dm-sans), sans-serif;
  transition: all 0.2s;
  color: #2C2420;
  box-sizing: border-box;
  
  &::placeholder {
    color: #aaa;
  }
  
  &:focus {
    outline: none;
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 0;
  border: 3px solid #2C2420;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  background: #782221;
  color: #F5F2E9;
  box-shadow: 4px 4px 0px 0px #2C2420;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px 0px #2C2420;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============================================
// 卡片样式
// ============================================

const MedicationCard = styled.div`
  background: #F5F2E9;
  border: 3px solid #2C2420;
  border-radius: 0;
  padding: 1.25rem;
  margin-bottom: 1rem;
  box-shadow: 4px 4px 0px 0px #2C2420;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  max-width: 60rem;
  margin-left: auto;
  margin-right: auto;
`;

const CardIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #782221, #9B2C2C);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
  
  svg {
    color: #F5F2E9;
  }
`;

const CardContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3<{ $completed?: boolean }>`
  font-size: 1rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 0.375rem 0;
  font-family: var(--font-playfair), serif;
  ${props => props.$completed && 'text-decoration: line-through; opacity: 0.6;'}
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  color: #5D4037;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  background: rgba(120, 34, 33, 0.08);
  border: 1px solid rgba(44, 36, 32, 0.15);
  font-size: 0.75rem;
  font-weight: 600;
  color: #782221;
`;

const CardNote = styled.p`
  font-size: 0.75rem;
  color: #5D4037;
  margin: 0.375rem 0 0 0;
  line-height: 1.4;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #5D4037;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    color: #782221;
  }
`;

const ActionMenu = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 3.5rem;
  right: 0.5rem;
  background: #F5F2E9;
  border: 3px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  z-index: 20;
  display: ${props => props.$show ? 'block' : 'none'};
  min-width: 8rem;
`;

const ActionMenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(44, 36, 32, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.$danger ? '#dc2626' : '#2C2420'};
  transition: background 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.$danger ? 'rgba(220, 38, 38, 0.05)' : 'rgba(120, 34, 33, 0.05)'};
  }
`;

// ============================================
// 重复类型配置
// ============================================

const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'none', label: '不重复' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
];

const REPEAT_LABELS: Record<RepeatType, string> = {
  none: '不重复',
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
};

const UNIT_OPTIONS = ['mg', 'ml', '片', '粒', '滴', '支'];

// ============================================
// 页面组件
// ============================================

export default function MedicationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [currentPet, setCurrentPet] = useState<UserPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pendingMeds, setPendingMeds] = useState<PetMedication[]>([]);
  const [completedMeds, setCompletedMeds] = useState<PetMedication[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    dosage_unit: '',
    start_date: new Date().toISOString().split('T')[0],
    reminder_time: '',
    repeat_type: 'none' as RepeatType,
    notes: '',
  });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      loadPets(userData.id);
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const loadPets = async (uid: string) => {
    setLoading(true);
    const data = await getUserPets(uid, false);
    if (data.length > 0) {
      setCurrentPet(data[0]);
      await loadMedications(data[0].id);
    }
    setLoading(false);
  };

  const loadMedications = async (petId: string) => {
    const pending = await getPendingMedications(petId);
    const completed = await getCompletedMedications(petId);
    setPendingMeds(pending);
    setCompletedMeds(completed);
  };

  const resetForm = () => {
    setFormData({
      medication_name: '',
      dosage: '',
      dosage_unit: '',
      start_date: new Date().toISOString().split('T')[0],
      reminder_time: '',
      repeat_type: 'none',
      notes: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.medication_name || !formData.start_date || !currentPet) {
      alert('请填写用药名称和开始日期');
      return;
    }

    setSubmitting(true);
    const result = await createMedication({
      pet_id: currentPet.id,
      medication_name: formData.medication_name,
      dosage: formData.dosage ? parseFloat(formData.dosage) : undefined,
      dosage_unit: formData.dosage_unit || undefined,
      start_date: formData.start_date,
      reminder_time: formData.reminder_time || undefined,
      repeat_type: formData.repeat_type,
      notes: formData.notes || undefined,
    });
    setSubmitting(false);

    if (result) {
      alert('用药计划创建成功！');
      setShowModal(false);
      resetForm();
      if (currentPet) {
        await loadMedications(currentPet.id);
      }
    } else {
      alert('创建失败，请重试');
    }
  };

  const handleComplete = async (medId: string) => {
    const success = await completeMedication(medId);
    if (success) {
      setOpenMenuId(null);
      if (currentPet) {
        await loadMedications(currentPet.id);
      }
    } else {
      alert('标记完成失败，请重试');
    }
  };

  const handleDelete = async (medId: string) => {
    if (confirm('确定要删除这个用药计划吗？')) {
      const success = await deleteMedication(medId);
      if (success) {
        setOpenMenuId(null);
        if (currentPet) {
          await loadMedications(currentPet.id);
        }
      } else {
        alert('删除失败，请重试');
      }
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div style={{ padding: '2rem', textAlign: 'center' }}>加载中...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>{currentPet?.name || '宠物'} 的用药</Title>
        </HeaderLeft>
        <AddButton onClick={() => setShowModal(true)}>
          <Plus size={24} />
        </AddButton>
      </Header>

      <TabContainer>
        <Tab 
          $active={activeTab === 'pending'}
          onClick={() => setActiveTab('pending')}
        >
          待办
        </Tab>
        <Tab 
          $active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
        >
          历史
        </Tab>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'pending' ? (
          pendingMeds.length > 0 ? (
            <div>
              {pendingMeds.map((med) => (
                <MedicationCard key={med.id}>
                  <CardIcon>
                    <Pill size={20} />
                  </CardIcon>
                  <CardContent>
                    <CardTitle>{med.medication_name}</CardTitle>
                    <CardMeta>
                      {med.dosage && (
                        <Badge>{med.dosage}{med.dosage_unit || ''}</Badge>
                      )}
                      <span>{med.start_date}</span>
                      {med.reminder_time && <span>{med.reminder_time}</span>}
                      {med.repeat_type !== 'none' && (
                        <Badge>{REPEAT_LABELS[med.repeat_type]}</Badge>
                      )}
                    </CardMeta>
                    {med.notes && <CardNote>{med.notes}</CardNote>}
                  </CardContent>
                  <MenuButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === med.id ? null : med.id);
                    }}
                  >
                    <MoreVertical size={20} />
                  </MenuButton>
                  <ActionMenu $show={openMenuId === med.id}>
                    <ActionMenuItem onClick={() => handleComplete(med.id)}>
                      <Check size={18} />
                      <span>标记完成</span>
                    </ActionMenuItem>
                    <ActionMenuItem $danger onClick={() => handleDelete(med.id)}>
                      <Trash2 size={18} />
                      <span>删除</span>
                    </ActionMenuItem>
                  </ActionMenu>
                </MedicationCard>
              ))}
            </div>
          ) : (
            <EmptyState>
              <div className="icon-wrapper">
                <Pill size={40} />
              </div>
              <h3>暂无用药计划</h3>
              <p>点击右上角 + 即可新增计划。</p>
            </EmptyState>
          )
        ) : (
          completedMeds.length > 0 ? (
            <div>
              {completedMeds.map((med) => (
                <MedicationCard key={med.id} style={{ opacity: 0.6 }}>
                  <CardIcon>
                    <Pill size={20} />
                  </CardIcon>
                  <CardContent>
                    <CardTitle $completed>{med.medication_name}</CardTitle>
                    <CardMeta>
                      {med.dosage && (
                        <Badge>{med.dosage}{med.dosage_unit || ''}</Badge>
                      )}
                      <span>{med.start_date}</span>
                      {med.completed_at && (
                        <Badge>
                          {new Date(med.completed_at).toLocaleString('zh-CN', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      )}
                    </CardMeta>
                  </CardContent>
                  <MenuButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === med.id ? null : med.id);
                    }}
                  >
                    <MoreVertical size={20} />
                  </MenuButton>
                  <ActionMenu $show={openMenuId === med.id}>
                    <ActionMenuItem $danger onClick={() => handleDelete(med.id)}>
                      <Trash2 size={18} />
                      <span>删除</span>
                    </ActionMenuItem>
                  </ActionMenu>
                </MedicationCard>
              ))}
            </div>
          ) : (
            <EmptyState>
              <div className="icon-wrapper">
                <Pill size={40} />
              </div>
              <h3>暂无历史记录</h3>
              <p>完成的用药计划会显示在这里。</p>
            </EmptyState>
          )
        )}
      </ContentContainer>

      {/* 新增用药计划弹窗 */}
      <ModalOverlay $show={showModal} onClick={() => setShowModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <div className="left">
              <div className="icon">💊</div>
              <h2>新增用药计划</h2>
            </div>
            <CloseButton onClick={() => setShowModal(false)}>
              <X size={18} />
            </CloseButton>
          </ModalHeader>

          <FormGroup>
            <label>用药名称</label>
            <Input
              placeholder="例如：驱虫药、消炎药"
              value={formData.medication_name}
              onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <label>剂量（可选）</label>
            <DosageRow>
              <DosageInput
                type="number"
                placeholder="例如：5"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
              />
              <UnitSelect
                value={formData.dosage_unit}
                onChange={(e) => setFormData({ ...formData, dosage_unit: e.target.value })}
              >
                <option value="">单位</option>
                {UNIT_OPTIONS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </UnitSelect>
            </DosageRow>
          </FormGroup>

          <FormGroup>
            <label>开始日期</label>
            <DateInputWrapper>
              <Calendar size={20} />
              <DateInput
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </DateInputWrapper>
          </FormGroup>

          <FormGroup>
            <label>提醒时间</label>
            <TimeInputWrapper>
              <Clock size={20} />
              <TimeInput
                type="time"
                value={formData.reminder_time}
                onChange={(e) => setFormData({ ...formData, reminder_time: e.target.value })}
              />
            </TimeInputWrapper>
          </FormGroup>

          <FormGroup>
            <label>重复设置</label>
            <RepeatGroup>
              {REPEAT_OPTIONS.map((opt) => (
                <RepeatButton
                  key={opt.value}
                  $active={formData.repeat_type === opt.value}
                  onClick={() => setFormData({ ...formData, repeat_type: opt.value })}
                >
                  {formData.repeat_type === opt.value && '✓ '}{opt.label}
                </RepeatButton>
              ))}
            </RepeatGroup>
          </FormGroup>

          <FormGroup>
            <label>备注（可选）</label>
            <TextArea
              placeholder="例如：空腹服用或搭配食物"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </FormGroup>

          <SubmitButton onClick={handleSubmit} disabled={submitting}>
            <CheckCircle size={20} />
            {submitting ? '保存中...' : '保存计划'}
          </SubmitButton>
        </ModalContent>
      </ModalOverlay>
    </PageContainer>
  );
}
