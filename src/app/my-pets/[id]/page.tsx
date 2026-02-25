'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styled from 'styled-components';
import { ArrowLeft, Edit, Calendar, Weight, Heart, FileText, Syringe, Activity, Bell, Plus } from 'lucide-react';
import { getUserPetById } from '@/lib/api/userPets';
import { 
  getHealthRecords, 
  getHealthReminders, 
  getWeightRecords, 
  getDailyLogs,
  completeReminder 
} from '@/lib/api/healthRecords';
import { UserPet, HealthRecord, HealthReminder, WeightRecord, DailyLog } from '@/lib/supabase';

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

const NotFoundContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fce7f3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotFoundContent = styled.div`
  text-align: center;
  
  .emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  button {
    color: #f97316;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: #ea580c;
    }
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
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
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

const EditButton = styled.button`
  background: #f97316;
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #ea580c;
  }
`;

const Main = styled.main`
  max-width: 72rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  font-weight: 500;
  white-space: nowrap;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.2s;
  position: relative;
  
  color: ${props => props.$active ? '#ea580c' : '#4b5563'};
  
  ${props => props.$active && `
    border-bottom: 2px solid #ea580c;
  `}
  
  &:hover {
    color: #ea580c;
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const NotesSection = styled.div`
  margin-top: 1.5rem;
  
  h3 {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #4b5563;
    background: #f9fafb;
    padding: 1rem;
    border-radius: 0.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
`;

const AddButton = styled.button`
  background: #f97316;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #ea580c;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
  
  svg {
    margin: 0 auto 1rem;
    color: #d1d5db;
  }
`;

const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RecordCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
`;

const RecordHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
`;

const TypeBadge = styled.span`
  background: #fed7aa;
  color: #c2410c;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const RecordTitle = styled.h3`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const RecordDescription = styled.p`
  color: #4b5563;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const RecordDetail = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const NextDueDate = styled.p`
  font-size: 0.875rem;
  color: #ea580c;
  margin-top: 0.5rem;
`;

const ReminderCard = styled.div<{ $completed: boolean }>`
  border: 1px solid ${props => props.$completed ? '#e5e7eb' : '#fed7aa'};
  background: ${props => props.$completed ? '#f9fafb' : '#fff7ed'};
  opacity: ${props => props.$completed ? 0.6 : 1};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ReminderContent = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
`;

const ReminderBadge = styled.span<{ $completed: boolean }>`
  background: ${props => props.$completed ? '#e5e7eb' : '#fed7aa'};
  color: ${props => props.$completed ? '#4b5563' : '#c2410c'};
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const CompleteButton = styled.button`
  margin-left: 1rem;
  background: #22c55e;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #16a34a;
  }
`;

const WeightRecordCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  p.weight {
    font-weight: 600;
    color: #1f2937;
  }
  
  p.date {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  p.notes {
    font-size: 0.875rem;
    color: #4b5563;
    margin-top: 0.25rem;
  }
`;

const LogCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
  
  .log-date {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }
`;

const LogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  font-size: 0.875rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .label {
    color: #6b7280;
  }
  
  .value {
    margin-left: 0.5rem;
    color: #1f2937;
  }
`;

const LogNotes = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
`;

const InfoItemContainer = styled.div`
  dt {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  dd {
    font-size: 1rem;
    color: #1f2937;
  }
`;

export default function PetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const petId = params?.id as string;

  const [pet, setPet] = useState<UserPet | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'health' | 'reminders' | 'weight' | 'logs'>('info');

  useEffect(() => {
    loadPetData();
  }, [petId]);

  const loadPetData = async () => {
    setLoading(true);
    const petData = await getUserPetById(petId);
    setPet(petData);

    if (petData) {
      const [records, remindersList, weights, logs] = await Promise.all([
        getHealthRecords(petId),
        getHealthReminders(petId),
        getWeightRecords(petId),
        getDailyLogs(petId)
      ]);

      setHealthRecords(records);
      setReminders(remindersList);
      setWeightRecords(weights);
      setDailyLogs(logs);
    }
    
    setLoading(false);
  };

  const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return '未知';
    
    const birth = new Date(birthDate);
    const today = new Date();
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();
    
    if (years === 0) {
      return `${months}个月`;
    } else if (months < 0) {
      return `${years - 1}岁${12 + months}个月`;
    } else {
      return months === 0 ? `${years}岁` : `${years}岁${months}个月`;
    }
  };

  const handleCompleteReminder = async (reminderId: string) => {
    const success = await completeReminder(reminderId);
    if (success) {
      loadPetData();
    }
  };

  const getRecordTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vaccine: '疫苗',
      deworming: '驱虫',
      checkup: '体检',
      illness: '疾病',
      surgery: '手术',
      other: '其他'
    };
    return labels[type] || type;
  };

  const getReminderTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vaccine: '疫苗',
      deworming: '驱虫',
      checkup: '体检',
      medication: '用药',
      grooming: '美容',
      custom: '自定义'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <div className="loading-text">加载中...</div>
      </LoadingContainer>
    );
  }

  if (!pet) {
    return (
      <NotFoundContainer>
        <NotFoundContent>
          <div className="emoji">😢</div>
          <h3>未找到宠物信息</h3>
          <button onClick={() => router.push('/my-pets')}>
            返回列表
          </button>
        </NotFoundContent>
      </NotFoundContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderContent>
          <HeaderLeft>
            <BackButton onClick={() => router.back()}>
              <ArrowLeft size={24} />
            </BackButton>
            <HeaderTitle>
              <h1>{pet.name}</h1>
              <p>{pet.custom_breed || '宠物档案'}</p>
            </HeaderTitle>
          </HeaderLeft>
          <EditButton onClick={() => router.push(`/my-pets/${pet.id}/edit`)}>
            <Edit size={18} />
            编辑
          </EditButton>
        </HeaderContent>
      </Header>

      <Main>
        <TabContainer>
          <TabList>
            <Tab $active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
              📝 基本信息
            </Tab>
            <Tab $active={activeTab === 'health'} onClick={() => setActiveTab('health')}>
              💉 健康记录 ({healthRecords.length})
            </Tab>
            <Tab $active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')}>
              🔔 健康提醒 ({reminders.filter(r => !r.is_completed).length})
            </Tab>
            <Tab $active={activeTab === 'weight'} onClick={() => setActiveTab('weight')}>
              ⚖️ 体重记录 ({weightRecords.length})
            </Tab>
            <Tab $active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
              📔 日常日志 ({dailyLogs.length})
            </Tab>
          </TabList>
        </TabContainer>

        <ContentArea>
          {activeTab === 'info' && (
            <div>
              <InfoGrid>
                <InfoItem label="性别" value={pet.gender === 'male' ? '雄性 ♂' : pet.gender === 'female' ? '雌性 ♀' : '未知'} />
                <InfoItem label="年龄" value={calculateAge(pet.birth_date)} />
                <InfoItem label="毛色" value={pet.color || '未填写'} />
                <InfoItem label="体重" value={pet.weight ? `${pet.weight} ${pet.weight_unit}` : '未填写'} />
                <InfoItem label="绝育状态" value={pet.is_neutered ? '已绝育' : '未绝育'} />
                <InfoItem label="芯片号码" value={pet.chip_number || '未填写'} />
                <InfoItem label="注册号码" value={pet.registration_number || '未填写'} />
                <InfoItem label="领养日期" value={pet.adoption_date || '未填写'} />
                <InfoItem label="来源" value={pet.source || '未填写'} />
              </InfoGrid>
              
              {pet.notes && (
                <NotesSection>
                  <h3>备注</h3>
                  <p>{pet.notes}</p>
                </NotesSection>
              )}
            </div>
          )}

          {activeTab === 'health' && (
            <div>
              <SectionHeader>
                <h2>健康记录</h2>
                <AddButton onClick={() => router.push(`/my-pets/${pet.id}/health/add`)}>
                  <Plus size={18} />
                  添加记录
                </AddButton>
              </SectionHeader>

              {healthRecords.length === 0 ? (
                <EmptyState>
                  <Syringe size={48} />
                  <p>还没有健康记录</p>
                </EmptyState>
              ) : (
                <RecordList>
                  {healthRecords.map((record) => (
                    <RecordCard key={record.id}>
                      <div>
                        <RecordHeader>
                          <TypeBadge>{getRecordTypeLabel(record.record_type)}</TypeBadge>
                          <DateText>{record.date}</DateText>
                        </RecordHeader>
                        <RecordTitle>{record.title}</RecordTitle>
                        {record.description && (
                          <RecordDescription>{record.description}</RecordDescription>
                        )}
                        {record.veterinarian && (
                          <RecordDetail>兽医: {record.veterinarian}</RecordDetail>
                        )}
                        {record.clinic && (
                          <RecordDetail>诊所: {record.clinic}</RecordDetail>
                        )}
                        {record.next_due_date && (
                          <NextDueDate>下次时间: {record.next_due_date}</NextDueDate>
                        )}
                      </div>
                    </RecordCard>
                  ))}
                </RecordList>
              )}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div>
              <SectionHeader>
                <h2>健康提醒</h2>
                <AddButton onClick={() => router.push(`/my-pets/${pet.id}/reminder/add`)}>
                  <Plus size={18} />
                  添加提醒
                </AddButton>
              </SectionHeader>

              {reminders.length === 0 ? (
                <EmptyState>
                  <Bell size={48} />
                  <p>还没有健康提醒</p>
                </EmptyState>
              ) : (
                <RecordList>
                  {reminders.map((reminder) => (
                    <ReminderCard key={reminder.id} $completed={reminder.is_completed}>
                      <ReminderContent>
                        <div>
                          <RecordHeader>
                            <ReminderBadge $completed={reminder.is_completed}>
                              {getReminderTypeLabel(reminder.reminder_type)}
                            </ReminderBadge>
                            <DateText>{reminder.remind_date}</DateText>
                          </RecordHeader>
                          <RecordTitle>{reminder.title}</RecordTitle>
                          {reminder.description && (
                            <RecordDescription>{reminder.description}</RecordDescription>
                          )}
                        </div>
                        {!reminder.is_completed && (
                          <CompleteButton onClick={() => handleCompleteReminder(reminder.id)}>
                            完成
                          </CompleteButton>
                        )}
                      </ReminderContent>
                    </ReminderCard>
                  ))}
                </RecordList>
              )}
            </div>
          )}

          {activeTab === 'weight' && (
            <div>
              <SectionHeader>
                <h2>体重记录</h2>
                <AddButton onClick={() => router.push(`/my-pets/${pet.id}/weight/add`)}>
                  <Plus size={18} />
                  添加记录
                </AddButton>
              </SectionHeader>

              {weightRecords.length === 0 ? (
                <EmptyState>
                  <Weight size={48} />
                  <p>还没有体重记录</p>
                </EmptyState>
              ) : (
                <RecordList>
                  {weightRecords.map((record) => (
                    <WeightRecordCard key={record.id}>
                      <div>
                        <p className="weight">{record.weight} {record.weight_unit}</p>
                        <p className="date">{record.record_date}</p>
                        {record.notes && <p className="notes">{record.notes}</p>}
                      </div>
                    </WeightRecordCard>
                  ))}
                </RecordList>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div>
              <SectionHeader>
                <h2>日常日志</h2>
                <AddButton onClick={() => router.push(`/my-pets/${pet.id}/log/add`)}>
                  <Plus size={18} />
                  添加日志
                </AddButton>
              </SectionHeader>

              {dailyLogs.length === 0 ? (
                <EmptyState>
                  <FileText size={48} />
                  <p>还没有日常日志</p>
                </EmptyState>
              ) : (
                <RecordList>
                  {dailyLogs.map((log) => (
                    <LogCard key={log.id}>
                      <p className="log-date">{log.log_date}</p>
                      <LogGrid>
                        {log.food_intake && (
                          <div>
                            <span className="label">饮食:</span>
                            <span className="value">{log.food_intake}</span>
                          </div>
                        )}
                        {log.water_intake && (
                          <div>
                            <span className="label">饮水:</span>
                            <span className="value">{log.water_intake}</span>
                          </div>
                        )}
                        {log.activity_level && (
                          <div>
                            <span className="label">活动:</span>
                            <span className="value">{log.activity_level}</span>
                          </div>
                        )}
                        {log.mood && (
                          <div>
                            <span className="label">情绪:</span>
                            <span className="value">{log.mood}</span>
                          </div>
                        )}
                      </LogGrid>
                      {log.notes && <LogNotes>{log.notes}</LogNotes>}
                    </LogCard>
                  ))}
                </RecordList>
              )}
            </div>
          )}
        </ContentArea>
      </Main>
    </PageContainer>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <InfoItemContainer>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </InfoItemContainer>
  );
}
