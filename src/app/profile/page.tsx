'use client';

import styled from 'styled-components';
import { User, Settings, Heart, FileText, Bell, Shield } from 'lucide-react';

const Container = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
`;

const Avatar = styled.div`
  width: 6rem;
  height: 6rem;
  background: #ea580c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 1rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ActionCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: #fef3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #ea580c;
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ActionDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

export default function ProfilePage() {
  return (
    <Container>
      <Header>
        <Title>我的</Title>
        <Subtitle>管理您的个人信息和宠物资料</Subtitle>
      </Header>

      <ProfileSection>
        <ProfileCard>
          <Avatar>
            <User size={32} />
          </Avatar>
          <UserName>宠物主人</UserName>
          <UserInfo>您好，欢迎使用爪爪管家！</UserInfo>
          <UserInfo>加入时间：2024年1月</UserInfo>
        </ProfileCard>

        <div>
          <QuickActions>
            <ActionCard>
              <ActionIcon>
                <Settings size={20} />
              </ActionIcon>
              <ActionTitle>账户设置</ActionTitle>
              <ActionDescription>修改个人信息和偏好设置</ActionDescription>
            </ActionCard>

            <ActionCard>
              <ActionIcon>
                <Heart size={20} />
              </ActionIcon>
              <ActionTitle>我的宠物</ActionTitle>
              <ActionDescription>查看和管理您的宠物档案</ActionDescription>
            </ActionCard>

            <ActionCard>
              <ActionIcon>
                <FileText size={20} />
              </ActionIcon>
              <ActionTitle>健康记录</ActionTitle>
              <ActionDescription>查看宠物的健康记录和提醒</ActionDescription>
            </ActionCard>

            <ActionCard>
              <ActionIcon>
                <Bell size={20} />
              </ActionIcon>
              <ActionTitle>消息通知</ActionTitle>
              <ActionDescription>管理您的通知设置</ActionDescription>
            </ActionCard>

            <ActionCard>
              <ActionIcon>
                <Shield size={20} />
              </ActionIcon>
              <ActionTitle>隐私安全</ActionTitle>
              <ActionDescription>隐私设置和账户安全</ActionDescription>
            </ActionCard>
          </QuickActions>
        </div>
      </ProfileSection>
    </Container>
  );
}
