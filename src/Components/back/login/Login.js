import React from 'react';
import {Link} from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
const env = process.env.NODE_ENV || 'production';
const config = require('../../../config/config.json')[env];

class Login extends React.Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    state = {
        loginMessage: '',
        loginStatus: false,
        token: this.props.cookies.get("token") || ""
    };

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleCookie = (token) => {
        const { cookies } = this.props;
        cookies.set("token", token, { path: "/" });
    };
   
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async handleClick () {
        const responseLogin = await fetch(`${config.api}/user/login/`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.user,
                password: this.state.pwd
            }) 
        });
        const loginJson = await responseLogin.json();
 
        this.setState({
            loginMessage: loginJson.message
        });

        if(responseLogin.status===200){
            this.setState({
                loginStatus: true
            });

            this.handleCookie(loginJson.token);

            this.props.history.push(`/posters/`);
        }
    }

    render() {    
        return (
            <div>
                <div>
                    <h2>User: 1234@gmail.com</h2>
                    <h2>Password: 1234</h2>
                    {this.state.loginMessage !== '' &&
                    <div className="alert alert-secondary" role="alert">
                        <p>{this.state.loginMessage}</p>
                    </div>
                        
                    }

                    <div className="form-group">
                        <div className="form-group">
                            <input type="text" name="user" onChange={this.handleInputChange} placeholder="User" />
                        </div>

                        <div className="form-group">
                            <input type="password" name="pwd" onChange={this.handleInputChange} placeholder="Password" />
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={() => this.handleClick()}>Login</button>

                    <p><Link to="/register/">Register</Link></p>
                </div>
            </div>
        )
      }

  }
  export default withCookies(Login);