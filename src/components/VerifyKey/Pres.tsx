import React from 'react';
import styled, { css } from 'styled-components';
import Button from 'components/Common/Button';
import Input from 'components/Common/Input';
import Loader from 'components/Common/Loader';
import { myTheme } from 'styles/theme';
import { authContainer } from 'styles/mixins/etc';

const Container = styled.div`
  ${authContainer};
`;

const Title = styled.p`
  text-indent: 1rem;
  font-size: 1.2rem;
  padding-bottom: ${props => props.theme.gap.medium};
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
`;

const Explain = styled.p`
  font-size: 0.9rem;
`;

const ModifyButtonStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ReceivedEmailContainer = styled.div`
  display: flex;
  align-content: center;
`;

const NotReceivedEmail = styled.p<{ loading: string }>`
  position: relative;
  font-size: 0.9rem;
  bottom: -0.2rem;
  ${props =>
    props.loading === 'true'
      ? css`
          color: ${props.theme.colors.secondary};
          cursor: not-allowed;
        `
      : css`
          color: ${props.theme.colors.blue};
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        `}
`;

const InputContainer = styled.div`
  > input {
    width: 100%;
  }
`;

const P = styled.p`
  font-size: 0.8rem;
  margin-top: ${props => props.theme.gap.tiny};
  text-align: right;
`;

const Span = styled.span`
  font-weight: bold;
`;

interface IProps {
  isSended?: boolean;
  email: string;
  verifyKey: () => void;
  resendLoading: boolean;
  sendSecret: () => void;
  secretKey: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
  };
  type: 'logIn' | 'register';
  verifyLoading: boolean;
}

export default ({
  isSended,
  email,
  verifyKey,
  resendLoading,
  sendSecret,
  secretKey,
  type,
  verifyLoading,
}: IProps) => (
  <>
    <Container>
      <Title>보안코드 확인</Title>
      <Explain>
        {type === 'logIn'
          ? '이메일로 전송되었던 보안코드를 입력해주세요.'
          : '이메일로 전송된 보안코드를 입력해주세요.'}
      </Explain>
      <InputContainer>
        <Input
          placeholder="보안코드 입력"
          {...secretKey}
          onKeyUp={e => (e.keyCode === 13 ? verifyKey() : null)}
        />
        {isSended && (
          <P>
            다음 이메일로 전송됨 : <Span>{email}</Span>
          </P>
        )}
      </InputContainer>
      <ModifyButtonStyle>
        <ReceivedEmailContainer>
          <NotReceivedEmail loading={resendLoading.toString()} onClick={sendSecret}>
            보안코드를 다시 보내겠습니까?
          </NotReceivedEmail>
          &nbsp;
          {resendLoading && <Loader color={myTheme.colors.secondary} position="relative" />}
        </ReceivedEmailContainer>
        <Button
          theme="withBg"
          disabled={secretKey.value === '' || resendLoading}
          onClick={verifyKey}
          loading={verifyLoading}
        >
          확인
        </Button>
      </ModifyButtonStyle>
    </Container>
  </>
);
