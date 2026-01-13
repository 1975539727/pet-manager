'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Heart, BookOpen, FileText, Bot, Plus } from "lucide-react";
import styled from 'styled-components';
import { useState } from 'react';
import { petCategories, PetCategory } from '@/data/petNavigation';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #fff7ed, #ffffff);
  padding: 20px;
`;

const PetNavigationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const CategoryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
`;

const CategoryTab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'clickable'
})<{ active: boolean; clickable?: boolean }>`
  padding: 16px 24px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.active ? '#ff6b35' : (props.clickable === false ? '#999' : '#666')};
  cursor: ${props => props.clickable === false ? 'default' : 'pointer'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.clickable === false ? '#999' : '#ff6b35'};
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #ff6b35;
    }
  `}
`;

const BreedsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  padding: 30px;
  max-height: 400px;
  overflow-y: auto;
`;

const BreedCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const BreedIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff9a85, #ff6b35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(255,107,53,0.3);
`;

const BreedName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
`;

const BreedDetails = styled.div`
  font-size: 12px;
  color: #999;
  display: flex;
  gap: 8px;
`;

const DetailItem = styled.span`
  padding: 2px 6px;
  background: #f5f5f5;
  border-radius: 10px;
`;

const AddMoreCard = styled(BreedCard)`
  opacity: 0.6;

  ${BreedIcon} {
    background: linear-gradient(135deg, #e0e0e0, #c0c0c0);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('dog');
  const router = useRouter();
  
  const currentCategory = petCategories.find(cat => cat.id === activeCategory);

  const handlePetClick = (breedId: string) => {
    router.push(`/pet/${activeCategory}/${breedId}`);
  };

  return (
    <Container>
      <PetNavigationContainer>
        <CategoryTabs>
          {petCategories.map((category) => (
            <CategoryTab
              key={category.id}
              active={activeCategory === category.id}
              clickable={category.isClickable !== false}
              onClick={() => {
                if (category.isClickable !== false) {
                  setActiveCategory(category.id);
                }
              }}
            >
              {category.name}
            </CategoryTab>
          ))}
        </CategoryTabs>

        <BreedsGrid>
          {currentCategory?.breeds.map((breed) => (
            <BreedCard key={breed.id} onClick={() => handlePetClick(breed.id)}>
              <BreedIcon>{breed.icon}</BreedIcon>
              <BreedName>{breed.name}</BreedName>
              <BreedDetails>
                <DetailItem>百科</DetailItem>
                <DetailItem>饲养</DetailItem>
                <DetailItem>护理</DetailItem>
              </BreedDetails>
            </BreedCard>
          ))}
          
          <AddMoreCard>
            <BreedIcon>
              <Plus size={24} color="#888" />
            </BreedIcon>
            <BreedName>更多</BreedName>
            <BreedDetails>
              <DetailItem>敬请期待</DetailItem>
            </BreedDetails>
          </AddMoreCard>
        </BreedsGrid>
      </PetNavigationContainer>
    </Container>
  );
}
