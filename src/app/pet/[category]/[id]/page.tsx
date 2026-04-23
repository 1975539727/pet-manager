'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Heart, Share, BookOpen, FileText, User, Home, Zap, Utensils, Search, X } from 'lucide-react';
import styled from 'styled-components';
import { getPetFullInfo } from '@/lib/api/pets';
import { FullPetInfo } from '@/lib/supabase';
import { petCategories } from '@/data/petNavigation';

const Container = styled.div`
  min-height: 100vh;
  background-color: #F5F2E9;
  background-image:
    linear-gradient(0deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent),
    linear-gradient(90deg, transparent 24%, rgba(120, 34, 33, .03) 25%, rgba(120, 34, 33, .03) 26%, transparent 27%, transparent 74%, rgba(120, 34, 33, .03) 75%, rgba(120, 34, 33, .03) 76%, transparent 77%, transparent);
  background-size: 50px 50px;
  font-family: var(--font-dm-sans), sans-serif;
`;

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(245, 242, 233, 0.95);
  backdrop-filter: blur(8px);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(44, 36, 32, 0.1);
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
  z-index: 100;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid #2C2420;
  background: transparent;
  border-radius: 0;
  cursor: pointer;
  color: #2C2420;
  font-weight: 600;
  transition: all 0.3s;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;

  &:hover {
    background: #782221;
    color: #F5F2E9;
    border-color: #782221;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: 2px solid #2C2420;
  background: transparent;
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #2C2420;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: #2C2420;
    color: #F5F2E9;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  padding-top: 96px;
`;

const PetHero = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 8px 8px 0px 0px #2C2420;
  border: 3px solid #2C2420;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: 12px 12px 0px 0px #2C2420;
    transform: translate(-2px, -2px);
  }
`;

const PetIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C5A059, #782221);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  border: 3px solid #2C2420;
  box-shadow: 4px 4px 0px 0px #2C2420;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: sepia(0.15) contrast(1.05);
  }
`;

const PetInfo = styled.div`
  flex: 1;
`;

const PetName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0 0 0.75rem 0;
  font-family: var(--font-playfair), serif;
`;

const PetCategory = styled.div`
  display: inline-block;
  font-size: 0.875rem;
  color: #F5F2E9;
  font-weight: 600;
  margin-bottom: 1rem;
  background: #782221;
  padding: 0.25rem 0.75rem;
  border: 2px solid #2C2420;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const PetDescription = styled.p`
  font-size: 1rem;
  color: #5D4037;
  line-height: 1.8;
  margin: 0;
  font-family: var(--font-dm-sans), sans-serif;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const Section = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 1.5rem;
  box-shadow: 6px 6px 0px 0px #2C2420;
  border: 3px solid #2C2420;
  transition: all 0.3s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0px 0px #2C2420;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(44, 36, 32, 0.1);
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0;
  background: linear-gradient(135deg, #782221, #9B2C2C);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const SectionContent = styled.div`
  color: #5D4037;
  line-height: 1.8;
  font-family: var(--font-dm-sans), sans-serif;

  ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  p {
    strong {
      color: #2C2420;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(44, 36, 32, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.25rem;
`;

const ModalContent = styled.div`
  background: #F5F2E9;
  border-radius: 0;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 8px 8px 0px 0px #2C2420;
  border: 3px solid #2C2420;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ModalIconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 0;
  background: linear-gradient(135deg, #782221, #9B2C2C);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  box-shadow: 2px 2px 0px 0px #2C2420;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2C2420;
  margin: 0;
  font-family: var(--font-playfair), serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border: 2px solid #2C2420;
  background: transparent;
  cursor: pointer;
  color: #2C2420;
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

const PetTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid #2C2420;
  border-radius: 0;
  margin-bottom: 1.5rem;
`;

const PetTagIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0;
  background: linear-gradient(135deg, #C5A059, #782221);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  overflow: hidden;
  border: 1px solid #2C2420;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PetTagText = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #2C2420;
  font-family: var(--font-cinzel), serif;
`;

const ModalDescription = styled.p`
  color: #5D4037;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-family: var(--font-dm-sans), sans-serif;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #2C2420;
  margin-bottom: 0.75rem;
  font-family: var(--font-playfair), serif;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #782221;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 3px solid #2C2420;
  border-radius: 0;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background: white;
  font-family: var(--font-dm-sans), sans-serif;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #782221;
    box-shadow: 3px 3px 0px 0px #782221;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.875rem 2rem;
  border-radius: 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;

  ${props => props.variant === 'primary' ? `
    background: #782221;
    color: #F5F2E9;
    border: 2px solid #2C2420;
    box-shadow: 3px 3px 0px 0px #2C2420;

    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0px 0px #2C2420;
    }
  ` : `
    background: transparent;
    color: #5D4037;
    border: 2px solid rgba(44, 36, 32, 0.3);

    &:hover {
      border-color: #2C2420;
      color: #2C2420;
    }
  `}
`;

const SectionButton = styled.button`
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #782221;
  color: #F5F2E9;
  border: 2px solid #2C2420;
  border-radius: 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  box-shadow: 3px 3px 0px 0px #2C2420;
  font-family: var(--font-cinzel), serif;
  letter-spacing: 0.05em;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px #2C2420;
  }
`;

export default function PetDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const [petInfo, setPetInfo] = useState<FullPetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDietModal, setShowDietModal] = useState(false);
  const [foodInput, setFoodInput] = useState('');

  useEffect(() => {
    async function loadPetData() {
      setLoading(true);
      try {
        const data = await getPetFullInfo(params?.id || '');
        console.log(data);
        
        // 如果数据库中的icon不是图片路径，从petNavigation中查找
        if (data && data.icon && !data.icon.startsWith('/')) {
          const category = petCategories.find(cat => cat.id === params?.category);
          if (category) {
            const breed = category.breeds.find(b => b.id === params?.id);
            if (breed && breed.icon) {
              data.icon = breed.icon;
            }
          }
        }
        
        setPetInfo(data);
      } catch (error) {
        console.error('获取宠物信息失败:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      loadPetData();
    }
  }, [params?.id, params?.category]);

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
          <div style={{ textAlign: 'center', paddingTop: '100px', color: '#2C2420', fontFamily: 'var(--font-playfair), serif' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>加载中...</h2>
            <p style={{ color: '#5D4037', fontFamily: 'var(--font-dm-sans), sans-serif' }}>正在获取宠物信息</p>
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
          <div style={{ textAlign: 'center', paddingTop: '100px', color: '#2C2420', fontFamily: 'var(--font-playfair), serif' }}>
            <h2 style={{ marginBottom: '0.5rem' }}>宠物信息未找到</h2>
            <p style={{ color: '#5D4037', fontFamily: 'var(--font-dm-sans), sans-serif' }}>请检查链接是否正确</p>
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
          <PetIcon>
            {petInfo.icon && petInfo.icon.startsWith('/') ? (
              <img src={petInfo.icon} alt={petInfo.name} />
            ) : (
              petInfo.icon || '🐾'
            )}
          </PetIcon>
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
              <SectionButton onClick={() => setShowDietModal(true)}>
                <Utensils size={18} />
                智能饮食查询
              </SectionButton>
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

        </SectionGrid>
      </MainContent>

      {showDietModal && (
        <ModalOverlay onClick={() => setShowDietModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowDietModal(false)}>
              <X size={20} />
            </CloseButton>
            
            <ModalHeader>
              <ModalIconWrapper>
                <Utensils size={24} />
              </ModalIconWrapper>
              <ModalTitle>智能饮食查询</ModalTitle>
            </ModalHeader>

            <PetTag>
              <PetTagIcon>
                {petInfo?.icon && petInfo.icon.startsWith('/') ? (
                  <img src={petInfo.icon} alt={petInfo.name} />
                ) : (
                  petInfo?.icon || '🐾'
                )}
              </PetTagIcon>
              <PetTagText>{petInfo?.name} ({petInfo?.category.name})</PetTagText>
            </PetTag>

            <ModalDescription>
              输入想确认的食物，我们会以专业兽医视角提供是否适合这只宠物食用的建议。
            </ModalDescription>

            <InputLabel>食物名称</InputLabel>
            <InputWrapper>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <Input
                type="text"
                placeholder="例如：苹果、巧克力"
                value={foodInput}
                onChange={(e) => setFoodInput(e.target.value)}
              />
            </InputWrapper>

            <ModalActions>
              <Button variant="secondary" onClick={() => setShowDietModal(false)}>
                取消
              </Button>
              <Button variant="primary" onClick={() => {
                // TODO: 实现查询逻辑
                console.log('查询食物:', foodInput);
                setShowDietModal(false);
                setFoodInput('');
              }}>
                <Search size={18} />
                立即查询
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
