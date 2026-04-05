'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { useState } from 'react';
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

const CategoriesSection = styled.section`
  padding: 112px 24px;
  background: #EFEDE6;
`;

const PetNavigationContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 48px;
  flex-wrap: wrap;
`;

const CategoryTab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'clickable'
})<{ active: boolean; clickable?: boolean }>`
  padding: 0;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.active ? '#782221' : (props.clickable === false ? '#999' : '#2C2420')};
  cursor: ${props => props.clickable === false ? 'default' : 'pointer'};
  position: relative;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: var(--font-cinzel), serif;

  &:hover {
    color: ${props => props.clickable === false ? '#999' : '#782221'};
  }

  ${props => props.active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: #782221;
      transition: width 0.3s;
    }
  `}
`;

const BreedsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  max-width: 1280px;
  margin: 0 auto;
`;

const BreedCard = styled.div`
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    transform: translateY(-4px);
  }
`;

const BreedCardInner = styled.div`
  position: relative;
  background: white;
  padding: 12px;
  border: 1px solid rgba(44, 36, 32, 0.1);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.5s;

  ${BreedCard}:hover & {
    box-shadow: 8px 8px 0px 0px #782221;
  }
`;

const BreedImageContainer = styled.div`
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  border: 1px solid rgba(44, 36, 32, 0.05);
  margin-bottom: 16px;
  background:
    linear-gradient(135deg, rgba(245, 242, 233, 0.95), rgba(239, 237, 230, 0.92)),
    repeating-linear-gradient(
      45deg,
      rgba(120, 34, 33, 0.05) 0,
      rgba(120, 34, 33, 0.05) 10px,
      transparent 10px,
      transparent 20px
    );
`;

const BreedImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.3) contrast(1.1) brightness(0.9);
  transition: transform 0.7s;

  ${BreedCard}:hover & {
    transform: scale(1.05);
  }
`;

const BreedIcon = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  background: linear-gradient(135deg, #F5F2E9, #EFEDE6);
`;

const BreedInfo = styled.div`
  padding: 8px 0;
  text-align: center;
`;

const BreedName = styled.h3`
  font-family: var(--font-playfair), serif;
  font-size: 20px;
  font-weight: 700;
  color: #2C2420;
  margin-bottom: 8px;
  transition: color 0.3s;

  ${BreedCard}:hover & {
    color: #782221;
  }
`;

const BreedPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;

  span:first-child, span:last-child {
    height: 1px;
    width: 32px;
    background: rgba(44, 36, 32, 0.2);
  }

  p {
    font-size: 14px;
    color: #782221;
    font-weight: 700;
    font-family: var(--font-cinzel), serif;
    letter-spacing: 0.15em;
  }
`;

const AddButton = styled.button`
  width: 100%;
  margin-top: 8px;
  background: #2C2420;
  color: #F5F2E9;
  padding: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  border: none;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #782221;
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
      {/* Categories Section */}
      <CategoriesSection>
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
                <BreedCardInner>
                  <BreedImageContainer>
                    {breed.icon.startsWith('/') ? (
                      <BreedImage
                        src={breed.icon}
                        alt={breed.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        loading="lazy"
                        placeholder="empty"
                      />
                    ) : (
                      <BreedIcon>{breed.icon}</BreedIcon>
                    )}
                  </BreedImageContainer>
                  <BreedInfo>
                    <BreedName>{breed.name}</BreedName>
                    <BreedPrice>
                      <span></span>
                      <p>查看详情</p>
                      <span></span>
                    </BreedPrice>
                  </BreedInfo>
                  <AddButton>了解更多</AddButton>
                </BreedCardInner>
              </BreedCard>
            ))}
          </BreedsGrid>
        </PetNavigationContainer>
      </CategoriesSection>
    </Container>
  );
}
