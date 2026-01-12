'use client';

import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
`;

const Content = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1rem;

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
`;

const Description = styled.p`
  color: #4b5563;
`;

export default function AssistantPage() {
  return (
    <Container>
      <Content>
        <Title>智能助手</Title>
        <Card>
          <Description>
            智能助手将为您提供宠物护理建议...
          </Description>
        </Card>
      </Content>
    </Container>
  );
}
