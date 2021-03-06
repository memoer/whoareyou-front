import React from 'react';
import styled from 'styled-components';
import { useInput, useApi } from 'hooks';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from 'store/reducer';
import Input from 'components/Common/Input';
import UserAvatar from 'components/User/Avatar';
import Button from 'components/Common/Button';
import userApi from 'api/user';
import { patchUser } from 'store/user/actions';
import { setMessage } from 'store/notification/actions';

const Container = styled.div`
  flex: 1;
  padding: ${props => props.theme.gap.huge} ${props => props.theme.gap.medium};
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: column;
    padding: ${props => props.theme.gap.medium} 0;
  }
`;

const InputContainer = styled.div`
  display: grid;
  align-items: center;
  justify-items: flex-start;
  grid-gap: ${props => props.theme.gap.medium};
  margin-left: ${props => props.theme.gap.huge};
  @media screen and (max-width: ${props => props.theme.breakpoints.lg}) {
    justify-items: center;
    margin-left: 0;
    margin-top: ${props => props.theme.gap.medium};
  }
`;

const LabelContainer = styled.div`
  > input,
  > textarea {
    width: ${props => props.theme.width.max.input};
  }
`;

const Label = styled.label`
  user-select: none;
  display: block;
  margin-bottom: ${props => props.theme.gap.small};
`;

const TextArea = styled.textarea`
  padding: ${props => props.theme.gap.small};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.basic};
  font-size: ${props => props.theme.fontSize.medium};
`;

export default () => {
  const user = useSelector((state: AppState) => state.user);
  const username = useInput(user.name);
  const introduce = useInput(user.introduce === null ? '' : user.introduce);
  const dispatch = useDispatch();
  const { loading, process } = useApi(userApi.patch, 'home');

  const onClick = () =>
    process({ name: username.value, introduce: introduce.value }).then(() => {
      dispatch(patchUser({ name: username.value, introduce: introduce.value }));
      dispatch(setMessage({ type: 'success', value: '수정되었습니다.' }));
    });

  const disabled = () => {
    const _introduce = user.introduce === null ? '' : user.introduce;
    if ((user.name === username.value && _introduce === introduce.value) || username.value === '')
      return true;
    return false;
  };

  // UserAvatar id="avatar" 삭제 추후 문제되면 다시 넣을 것
  return (
    <Container>
      <UserAvatar page="userEdit" />
      <InputContainer>
        <LabelContainer>
          <Label htmlFor="username">이름</Label>
          <Input placeholder="이름" id="username" {...username} />
        </LabelContainer>
        <LabelContainer>
          <Label htmlFor="introduce">소개</Label>
          <TextArea placeholder="소개" id="introduce" {...introduce} />
        </LabelContainer>
        <Button
          theme="withBg"
          padding="small"
          disabled={disabled()}
          loading={loading}
          onClick={onClick}
        >
          확인
        </Button>
      </InputContainer>
    </Container>
  );
};
