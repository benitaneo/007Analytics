import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, CardImg, Button, Input, InputGroup, InputGroupAddon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import firebase from '../../../firebase';

// import material-ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

// import slider dependencies
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import '../../../../scss/css/slider-animations.css';
import '../../../../scss/css/styles.css';

// import login functions
import SocialButton from './SocialButton'

const content = [
	{
		title: 'CodeCombat Analytics, Your Best Companion in Learning Progress',
		description:
		'Get your real-time analysis done right here, all you have to do is register an account at CodeCombat!',
		button: 'Login',
		image: 'https://i.imgur.com/ZXBtVw7.jpg',
		user: '007Analytics',
    userProfile: '../../../img/flags/Singapore.png',
    url: '/loginbox'
  },
  {
		title: 'Learn Programming in a Fun manner',
		description:
		'With CodeCombat, getting started on programming is no longer difficult!',
		button: 'Sign Up!',
		image: 'https://i.imgur.com/DvmN8Hx.jpg',
		user: 'CodeCombat CEO',
    userProfile: '../../../img/avatars/4.jpg',
    url: 'https://codecombat.com'
	},
	{
		title: 'Clean and Sleek layout, perfectly user-friendly for all',
		description:
		'An amazing tool for anyone who is getting started on Programming!',
		button: 'Discover',
		image: 'https://i.imgur.com/DCdBXcq.jpg',
		user: 'Chris Boesch',
		userProfile: '../../../img/avatars/3.jpg'
	}
];

const styles = {
  button: {
    margin: 10,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

const handleSocialLogin = (user) => {
  console.log(user)
}
 
const handleSocialLoginFailure = (err) => {
  console.error(err)
}

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }
  
  render() {
    return (
      <MuiThemeProvider>
        <div>
      <Slider className="slider-wrapper" autoplay="1500">
        {content.map((item, index) => (
          <div
            key={index}
            className="slider-content"
            style={{ background: `url('${item.image}') no-repeat center center` }}
          >
            <div className="inner">
              <h1>{item.title}</h1>
              <p>{item.description}</p>
            </div>
            <section>
              <img src={item.userProfile} alt={item.user} />
              <span>
                Posted by <strong>{item.user}</strong>
              </span>
            </section>
          </div>
        ))}
      </Slider>
      
      <Row className="justify-content-center">
        <SocialButton
          provider='google'
          appId='dashboard-235a6'
          onLoginSuccess={handleSocialLogin}
          onLoginFailure={handleSocialLoginFailure}
        >
          Login with Google
        </SocialButton>
      </Row>
      <Row className="justify-content-center">
      <RaisedButton
        href="https://github.com/callemall/material-ui"
        target="_blank"
        label="Login"
        style={styles.button}
        primary={true}
      />
      </Row>
      <Row className="justify-content-center">
      <RaisedButton
        href="https://codecombat.com"
        target="_blank"
        label="Sign Up"
        style={styles.button}
        primary={true}
      />
      </Row>
      </div>
      </MuiThemeProvider>
      
    )
  }
}

export default Landing;
