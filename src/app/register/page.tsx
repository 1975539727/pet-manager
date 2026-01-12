'use client';

import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  max-width: 28rem;
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;

  &:focus {
    border-color: #ea580c;
    box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #ea580c;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c2410c;
  }
`;

export default function RegisterPage() {
  return (
    <Container>
      <FormContainer>
        <Title>注册</Title>
        <Form>
          <FormGroup>
            <Label>
              用户名
            </Label>
            <Input
              type="text"
              placeholder="请输入用户名"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              邮箱
            </Label>
            <Input
              type="email"
              placeholder="请输入邮箱"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              密码
            </Label>
            <Input
              type="password"
              placeholder="请输入密码"
            />
          </FormGroup>
          <FormGroup>
            <Label>
              确认密码
            </Label>
            <Input
              type="password"
              placeholder="请再次输入密码"
            />
          </FormGroup>
          <Button type="submit">
            注册
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
}
