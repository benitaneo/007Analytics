import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, CardImg, Button, Input, InputGroup, InputGroupAddon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import firebase from '../../../firebase';
import Footer from '../../../components/Footer';

// import slider dependencies
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import '../../../../scss/css/slider-animations.css';
import '../../../../scss/css/styles.css';

// import material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

const content = [
	{
		title: 'CodeCombat Analytics, Your Best Companion in Learning Progress',
		description:
		'Get your real-time analysis done right here, all you have to do is register an account at CodeCombat!',
		button: 'Login',
		image: 'https://i.imgur.com/ZXBtVw7.jpg',
		user: '007Analytics',
    userProfile: '../../../img/flags/Singapore.png'
  },
  {
		title: 'Learn Programming in a Fun manner',
		description:
		'With CodeCombat, getting started on programming is no longer difficult!',
		button: 'Sign Up!',
		image: 'https://i.imgur.com/DvmN8Hx.jpg',
		user: 'CodeCombat CEO',
    userProfile: '../../../img/avatars/4.jpg'
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

class Login extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleCredentials = this.toggleCredentials.bind(this);
    this.state = {
      user: "",
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleCredentials(role) {
    if (this.state.user !== role) {
      this.setState({
        user: role
      });
    }
  }

  routePage() {
    if (this.state.user == "administrator") {
      window.location = "#/administrator"
    } else if (this.state.user == "instructor") {
      window.location = "#/instructor"
    } else if (this.state.user == "student") {
      window.location = "#/student"
    }
  }
  
  render() {
    console.log(this.state.user);
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
        <br />
        <br />
        <Row className="justify-content-center">
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              Select Your Role
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => { this.toggleCredentials('administrator'); }}>Administrator</DropdownItem>
              <DropdownItem onClick={() => { this.toggleCredentials('instructor'); }}>Instructor</DropdownItem>
              <DropdownItem onClick={() => { this.toggleCredentials('student'); }}>Student</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Row>
        <Row className="justify-content-center">
          <RaisedButton
            target="_blank"
            label="Login"
            style={styles.button}
            primary={true}
            onClick={() => this.routePage()}
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
    );
  }
}

export default Login;
