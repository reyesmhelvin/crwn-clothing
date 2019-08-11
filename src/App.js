import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { auth, createUserProfileDocument } from './firebase/firebase.util';


import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import SignInSignOut from './pages/sign-in-sign-up/sign-in-sign-up.component';
import Header from './components/header/header.component';

import { setCurrentUser } from './redux/user/user.actions'



class App extends React.Component {

  unSubscribeFromAuth = null;

  componentDidMount() {

    const { setCurrentUser } = this.props;

    this.unSubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
              id: snapShot.id,
              ...snapShot.data()
          });

        });

      } else {
        setCurrentUser(userAuth);
      }
      

    })
  }

  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }

  render() {
    return (
      <div>
          <Header/>
          <Switch>
            <Route exact path='/' component={HomePage}/>
            <Route path='/shop' component={ShopPage}/>
            <Route path='/signin' component={SignInSignOut}/>
          </Switch>
      </div>
    );
  }
  
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
}); 

export default connect(null, mapDispatchToProps)(App);
