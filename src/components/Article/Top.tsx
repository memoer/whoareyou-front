import React, { useContext } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'pages/User';
import { useApi } from 'hooks';
import { useDispatch, useSelector } from 'react-redux';
import { ArticleContext } from 'context/article';
import { AppState } from 'store/reducer';
import { removeArticle } from 'store/articleArr/actions';
import { setMessage } from 'store/notification/actions';
import { setEditArticle } from 'store/editArticle/actions';
import { black } from 'styles/mixins/etc';
import Button from 'components/Common/Button';
import tempAvatar from 'assets/avatar.png';
import moment from 'moment';
import articleApi from 'api/article';
import Loader from 'components/Common/Loader';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.gap.small};
`;

interface IAvatar {
  url?: string | null;
}
const Avatar = styled.div<IAvatar>`
  background-image: ${props => (props.url ? `url(${props.url})` : `url(${tempAvatar})`)};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.avatar};
  display: inline-block;
  margin-right: ${props => props.theme.gap.small};
  cursor: pointer;
`;

const CreatorContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CreatorName = styled.p`
  cursor: pointer;
  &:active {
    color: ${props => props.theme.colors.secondary};
  }
`;

const CreatedAt = styled.p`
  opacity: 0.5;
  font-size: ${props => props.theme.fontSize.small};
  margin-top: ${props => props.theme.gap.tiny};
`;

const Func = styled.div`
  display: flex;
`;

const Black = styled.div`
  position: absolute;
  ${black}
  display:flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

interface IProps {
  history: {
    push: (path: string) => void;
  };
}

const Top = ({ history: { push } }: IProps) => {
  const data = useContext(ArticleContext);
  const { isMe } = useContext(UserContext);
  const { process, loading } = useApi(articleApi.remove, 'home');
  const { avatar } = useSelector((state: AppState) => state.user);
  const dispatch = useDispatch();
  const { creator, createdAt, id, photos, content } = useSelector(
    (state: AppState) => state.articleArr[data.index],
  );

  const onRemove = () => {
    if (!isMe) return;
    if (!window.confirm('삭제하시겠습니까?')) return;
    process({ id }).then(() => {
      dispatch(removeArticle(data.index));
      dispatch(setMessage({ type: 'success', value: '삭제되었습니다.' }));
    });
  };

  return (
    <>
      {loading && (
        <Black>
          <Loader size={2} />
        </Black>
      )}
      <Container>
        <CreatorContainer>
          <Avatar
            url={isMe ? avatar : creator.avatar}
            onClick={() => push(`/user/${creator.id}`)}
          />
          <div>
            <CreatorName onClick={() => push(`/user/${creator.id}`)}>{creator.name}</CreatorName>
            <CreatedAt>{moment(createdAt).fromNow()}</CreatedAt>
          </div>
        </CreatorContainer>
        <Func>
          {isMe && (
            <>
              <Button icon={faTrash} color="danger" theme="noBg" onClick={onRemove} />
              <Button
                icon={faEdit}
                theme="noBg"
                onClick={() => {
                  dispatch(setEditArticle({ id, content, photos }));
                  push('/edit');
                }}
              />
            </>
          )}
        </Func>
      </Container>
    </>
  );
};

export default withRouter(Top);
