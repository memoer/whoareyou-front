import React, { useEffect } from 'react';
import styled from 'styled-components';
import Button from 'components/Common/Button';
import linkCss from 'styles/mixins/link';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useInput } from 'hooks';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AppState } from 'store/reducer';
import { toggleVisiblePopover, hideUserPopover, toggleCreateArticle } from 'store/header/actions';
import Input from './Input';
import UserPopover from '../User/Popover';
import HeaderNav from './HeaderNav';

const Layout = styled.div`
  @media screen and (max-width: ${props => props.theme.breakpoints.lg}) {
    background-color: white;
    z-index: ${props => props.theme.zIndex.header};
    position: fixed;
    border-bottom: 1px solid ${props => props.theme.colors.secondary};
  }
`;

const Container = styled.header<{ contract: boolean }>`
  transition: height 0.2s;
  position: fixed;
  width: 100vw;
  z-index: ${props => props.theme.zIndex.header};
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: auto 1fr auto;
  grid-gap: ${props => props.theme.gap.small};
  align-items: center;
  height: ${props => (props.contract ? props.theme.height.smallHeader : props.theme.height.header)};
  padding: 0 ${props => props.theme.gap.medium};
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
  background-color: white;
  @media screen and (max-width: ${props => props.theme.breakpoints.lg}) {
    position: relative;
    border-bottom: 0;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 ${props => props.theme.gap.medium};
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.sm}) {
    padding: 0 ${props => props.theme.gap.tiny};
  }
`;

const Flex = styled.div`
  display: flex;
  &:nth-child(2) {
    justify-content: center;
    > div {
      padding: ${props => props.theme.gap.tiny} ${props => props.theme.gap.medium};
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
`;

const CustomInput = styled(Input)`
  /**
  * ToDo : sm 에서 검색 input창 제거
  */
  padding-top: ${props => props.theme.gap.tiny};
  padding-bottom: ${props => props.theme.gap.tiny};
  width: 100%;
  max-width: 500px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
  max-width: ${props => props.theme.width.max.input};
`;

const UserContainer = styled.div`
  position: relative;
`;

const CustomLink = styled(Link)`
  ${linkCss.basic}
  ${linkCss.noBg}
`;

export default () => {
  const search = useInput('');
  const username = useSelector((state: AppState) => state.user.name);
  const visible = useSelector((state: AppState) => state.header.visible.userPopover);
  const dispatch = useDispatch();
  const { contract } = useSelector((state: AppState) => state.header);

  const hideUserPopoverHandler = () => visible && dispatch(hideUserPopover());

  // 만약 deps를 [] 로만 설정하면 맨 처음 mount될때에만 event를 생성하여 추가하므로 visibl을 이벤트 함수 내에서 읽으면 항상 false이다.
  // 왜냐하면 이벤트는 한 번 추가되었고 그 추가되었을 당시에는 visible은 false이니 visible이 변경된다 한들, 이벤트함수는 여전히 visible을 false로 인식하는 것.
  // useEffect(() => {
  //   window.addEventListener('click', hideUserPopoverHandler);
  //   return () => window.removeEventListener('click', hideUserPopoverHandler);
  // }, []);
  // * react는 새로 렌더링될 때마다 모든 함수와 모든 변수들을 새로 만들고 다시 시작한다.
  // * visible이 변경될때마다 기존에 있던 함수는 제거(return)하고 새로운 함수를 넣어주는 것이다.
  useEffect(() => {
    // * 이후 visible이 true됐을 때의 리렌더링이 된 component가 새로운 함수를 다시 추가시켜주는 것!
    window.addEventListener('click', hideUserPopoverHandler);
    // * visible 초기값 false이 "true"로 변경되면 기존에 있던 함수를 제거하는 것임.
    return () => window.removeEventListener('click', hideUserPopoverHandler);
  }, [visible]);

  return (
    <Layout>
      <Container contract={contract}>
        <Flex>
          <CustomLink to="/latest">WhoAreYou</CustomLink>
        </Flex>
        <Flex>
          <CustomInput padding="tiny" placeholder="검색" {...search} />
          <Button theme="withBg" icon={faSearch} onClick={() => null} />
        </Flex>
        <Flex>
          {username && (
            <Button icon={faPlus} theme="noBg" onClick={() => dispatch(toggleCreateArticle())} />
          )}
          <UserContainer className="username">
            {username ? (
              <Button
                theme="noBg"
                onClick={e => {
                  e.stopPropagation();
                  dispatch(toggleVisiblePopover());
                }}
              >
                {username}
              </Button>
            ) : (
              <CustomLink to="/">로그인</CustomLink>
            )}
            <UserPopover />
          </UserContainer>
        </Flex>
      </Container>
      <HeaderNav />
    </Layout>
  );
};
