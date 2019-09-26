import React, {Component} from 'react';
import Cookies from "js-cookie";
import Data from './Data';


const Context = React.createContext();

export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('user') || null,
    userPassword: Cookies.getJSON('userPassword') || null,
  };

  constructor() {
    super();
    this.data = new Data();

  }

  render() {
    const {authenticatedUser} = this.state;
    const {userPassword} = this.state;
    const value = {
      authenticatedUser,
      userPassword,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      },
    };

    return (
        <Context.Provider value={value}>
          {this.props.children}
        </Context.Provider>
    );
  }

  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
          userPassword: password,
        };
      });
      // user.password = btoa(`${emailAddress}:${password}`);
      // localStorage.setItem('user', JSON.stringify(user));
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
      Cookies.set('userPassword', JSON.stringify(password), { expires: 1 });

    }
    return user;
  };

  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
      };
    });
    Cookies.remove('authenticatedUser');
    Cookies.remove('userPassword')
  }
}

export const Consumer = Context.Consumer;

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
        <Context.Consumer>
          {context => <Component {...props} context={context}/>}
        </Context.Consumer>
    );
  }
}
