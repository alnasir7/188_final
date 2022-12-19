/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './style/nav.css';
import './style/App.css';
import 'antd/dist/antd.css';
import 'bulma/css/bulma.css';
import './style/Home.css';
import './style/HomeGroups.css';
import Home from './components/loginPage/home';
import GroupPage from './components/groupPage/GroupPage';
import Navbar from './components/loginPage/navbar';
import DetailsPage from './components/postDetailsPage/DetailsPage';
import MessagePage from './components/messagesPage/messages';
import Settings from './components/mainPage/settings';
import GroupSettingsPage from './components/groupSettingsPage/groupSettingsPage';
import MainPage from './components/mainPage/mainPage';
import MyInvites from './components/mainPage/myInvites';
import store from './redux/store';
import PrivateRoute from './components/routing/privateRoute';
import PublicRoute from './components/routing/publicRoute';

function App() {
  return (
    <div className="app-container" id="root">
      <Provider store={store}>
        <Router>
          <Navbar/>
          <div id="content">
            <Switch>
              <PublicRoute path="/" exact component={Home}/>
              <PrivateRoute path="/group" exact component={GroupPage}/>
              <PrivateRoute path="/groupSettings/:groupName" exact component={GroupSettingsPage}/>
              <PrivateRoute path="/post/:id" exact component={DetailsPage}/>
              <PrivateRoute path="/group/:groupName" exact component={GroupPage}/>
              <PrivateRoute path="/group/:group/:postId" exact component={DetailsPage}/>
              <PrivateRoute path="/messages" exact component={MessagePage}/>
              <PrivateRoute path="/invites" exact component={MyInvites}/>
              <PrivateRoute path="/settings" exact component={Settings}/>
              <PrivateRoute path="/main" exact component={MainPage}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
