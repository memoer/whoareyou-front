import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {
  LogIn,
  Register,
  FindPassword,
  LatestArticle,
  User,
  UserEdit,
  OAuthCallBack,
  CreateArticle,
  EditArticle,
} from 'pages';
import { useSelector } from 'react-redux';
import { AppState } from 'store/reducer';

const Routes = () => {
  const isLogged = useSelector((state: AppState) => state.user.id !== -1);
  return isLogged ? (
    <Switch>
      <Route exact path="/" component={LatestArticle} />
      <Route path="/user/edit" component={UserEdit} />
      <Route path="/user/:id" component={User} />
      <Route path="/new" component={CreateArticle} />
      <Route path="/edit" component={EditArticle} />
      <Redirect from="*" to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route exact path="/" component={LogIn} />
      <Route path="/register" component={Register} />
      <Route path="/findPassword" component={FindPassword} />
      <Route path="/latest" component={LatestArticle} />
      <Route path="/callback" component={OAuthCallBack} />
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Routes;
