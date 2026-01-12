'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, Share, BookOpen, FileText, Bot, User, Home, Zap } from 'lucide-react';
import styled from 'styled-components';
import { getPetFullInfo } from '@/lib/api/pets';
import { FullPetInfo } from '@/lib/supabase';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #fff7ed, #ffffff);
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #e8e8e8;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  transition: all 0.2s;

  &:hover {
    border-color: #ff6b35;
    color: #ff6b35;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const PetHero = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 40px;
`;

const PetIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9a85, #ff6b35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  box-shadow: 0 8px 30px rgba(255,107,53,0.4);
`;

const PetInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0 0 12px 0;
`;

const PetCategory = styled.div`
  font-size: 16px;
  color: #ff6b35;
  font-weight: 500;
  margin-bottom: 16px;
`;

const PetDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 30px;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #ff6b35;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const SectionContent = styled.div`
  color: #666;
  line-height: 1.6;

  ul {
    margin: 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 8px;
  }
`;

export default function PetDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const [petInfo, setPetInfo] = useState<FullPetInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPetData() {
      setLoading(true);
      try {
        const data = await getPetFullInfo(params.id);
        console.log(data);
        setPetInfo(data);
      } catch (error) {
        console.error('获取宠物信息失败:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadPetData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Link href="/">
              <BackButton>
                <ArrowLeft size={20} />
                返回首页
              </BackButton>
            </Link>
          </HeaderContent>
        </Header>
        <MainContent>
          <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h2>加载中...</h2>
            <p>正在获取宠物信息</p>
          </div>
        </MainContent>
      </Container>
    );
  }

  if (!petInfo) {
    return (
      <Container>
        <Header>
          <HeaderContent>
            <Link href="/">
              <BackButton>
                <ArrowLeft size={20} />
                返回首页
              </BackButton>
            </Link>
          </HeaderContent>
        </Header>
        <MainContent>
          <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h2>宠物信息未找到</h2>
            <p>请检查链接是否正确</p>
          </div>
        </MainContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Link href="/">
            <BackButton>
              <ArrowLeft size={20} />
              返回首页
            </BackButton>
          </Link>
          <ActionButtons>
            <ActionButton>
              <Heart size={18} />
              收藏
            </ActionButton>
            <ActionButton>
              <Share size={18} />
              分享
            </ActionButton>
          </ActionButtons>
        </HeaderContent>
      </Header>

      <MainContent>
        <PetHero>
          <PetIcon>{petInfo.icon || '🐾'}</PetIcon>
          <PetInfo>
            <PetName>{petInfo.name}</PetName>
            <PetCategory>{petInfo.category.name}</PetCategory>
            <PetDescription>
              {petInfo.details?.description || 
                `了解${petInfo.name}的详细信息，包括饲养指南、健康护理、训练技巧等专业知识。为您的爱宠提供最贴心的照顾建议。`}
            </PetDescription>
          </PetInfo>
        </PetHero>

        <SectionGrid>
          <Section>
            <SectionHeader>
              <SectionIcon>
                <BookOpen size={20} />
              </SectionIcon>
              <SectionTitle>品种百科</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p><strong>{petInfo.name}</strong>{petInfo.name_en ? ` (${petInfo.name_en})` : ''}</p>
              {petInfo.details && (
                <ul>
                  {petInfo.details.size && <li>体型：{petInfo.details.size === 'small' ? '小型' : petInfo.details.size === 'medium' ? '中型' : '大型'}</li>}
                  {petInfo.details.weight_min && petInfo.details.weight_max && (
                    <li>体重：{petInfo.details.weight_min} - {petInfo.details.weight_max} {petInfo.details.weight_unit || 'kg'}</li>
                  )}
                  {petInfo.details.height_min && petInfo.details.height_max && (
                    <li>身高：{petInfo.details.height_min} - {petInfo.details.height_max} {petInfo.details.height_unit || 'cm'}</li>
                  )}
                  {petInfo.details.lifespan_min && petInfo.details.lifespan_max && (
                    <li>寿命：{petInfo.details.lifespan_min} - {petInfo.details.lifespan_max} 年</li>
                  )}
                  {petInfo.details.activity_level && (
                    <li>活动量：{petInfo.details.activity_level === 'low' ? '低' : petInfo.details.activity_level === 'medium' ? '中等' : '高'}</li>
                  )}
                  {petInfo.temperaments && petInfo.temperaments.length > 0 && (
                    <li>性格：{petInfo.temperaments.map(t => t.temperament).join('、')}</li>
                  )}
                </ul>
              )}
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>
                <FileText size={20} />
              </SectionIcon>
              <SectionTitle>饲养指南</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>科学的饲养方法能让您的{petInfo.name}更健康快乐：</p>
              <ul>
                {petInfo.details?.diet_info && <li>饮食：{petInfo.details.diet_info}</li>}
                {petInfo.details?.feeding_frequency && <li>喂食频率：{petInfo.details.feeding_frequency}</li>}
                {petInfo.details?.special_diet && <li>特殊饮食：{petInfo.details.special_diet}</li>}
                {petInfo.details?.grooming_needs && (
                  <li>美容护理：{petInfo.details.grooming_needs === 'low' ? '简单' : petInfo.details.grooming_needs === 'medium' ? '中等' : '频繁'}</li>
                )}
                {petInfo.details?.care_difficulty && (
                  <li>饲养难度：{petInfo.details.care_difficulty === 'easy' ? '简单' : petInfo.details.care_difficulty === 'medium' ? '中等' : '困难'}</li>
                )}
                {!petInfo.details && (
                  <>
                    <li>合理的饮食搭配和营养补充</li>
                    <li>定期的运动和娱乐活动</li>
                    <li>舒适的生活环境布置</li>
                    <li>日常清洁和护理要点</li>
                  </>
                )}
              </ul>
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>
                <Heart size={20} />
              </SectionIcon>
              <SectionTitle>健康护理</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>预防胜于治疗，了解{petInfo.name}的健康护理要点：</p>
              <ul>
                {petInfo.health_tips && petInfo.health_tips.length > 0 ? (
                  petInfo.health_tips.slice(0, 5).map((tip, index) => (
                    <li key={index}>{tip.tip_description}</li>
                  ))
                ) : (
                  <>
                    <li>定期疫苗接种和体检</li>
                    <li>常见疾病的预防和识别</li>
                    <li>日常健康监测指标</li>
                    <li>紧急情况的应对措施</li>
                    <li>营养保健品的选择建议</li>
                  </>
                )}
              </ul>
            </SectionContent>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>
                <Bot size={20} />
              </SectionIcon>
              <SectionTitle>智能助手</SectionTitle>
            </SectionHeader>
            <SectionContent>
              <p>我们的AI助手随时为您解答关于{petInfo.name}的任何问题：</p>
              <ul>
                {petInfo.training_commands && petInfo.training_commands.length > 0 ? (
                  petInfo.training_commands.slice(0, 5).map((cmd, index) => (
                    <li key={index}>
                      {cmd.command_name} - {cmd.description || '基础训练指令'}
                      {cmd.difficulty_level && ` (难度: ${cmd.difficulty_level}/5)`}
                    </li>
                  ))
                ) : (
                  <>
                    <li>个性化饲养建议</li>
                    <li>健康问题咨询</li>
                    <li>行为问题解答</li>
                    <li>训练技巧指导</li>
                    <li>紧急情况处理</li>
                  </>
                )}
              </ul>
              <button style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                开始咨询
              </button>
            </SectionContent>
          </Section>
        </SectionGrid>
      </MainContent>
    </Container>
  );
}
