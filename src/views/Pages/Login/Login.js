import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, CardImg, Button, Input, InputGroup, InputGroupAddon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Footer from '../../../components/Footer';

// import slider dependencies
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import '../../../../scss/css/slider-animations.css';
import '../../../../scss/css/styles.css';

// import material ui components
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { blue50, blueA100 } from 'material-ui/styles/colors'

const content = [
	{
		title: 'CodeCombat Analytics, Your Best Companion in Learning Progress',
		description:
		'Get your real-time analysis done right here, all you have to do is register an account at CodeCombat!',
		button: 'Login',
		image: 'https://i.imgur.com/ZXBtVw7.jpg',
		user: '007Analytics',
    userProfile: '../../../img/007analytics.jpg'
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
		image: '../../../img/phone.jpg',
		user: 'ALSET Team',
		userProfile: '../../../img/flags/Singapore.png'
	}
];

const material_styles = {
  errorStyle: {
    color: blueA100
  },
  underlineStyle: {
    borderColor: blueA100
  },
  floatingLabelStyle: {
    color: blueA100
  },
  floatingLabelFocusStyle: {
    color: blueA100
  },
  inputTextStyle: {
    color: blueA100
  },
  hintTextStyle: {
    color: blueA100
  },
  hintStyle: {
    opaque: 100
  }
};

const styles = {
  button: {
    margin: 10,
    color: blue50
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

    this.handleRole = this.handleRole.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    /*this.toggle = this.toggle.bind(this);
    this.toggleCredentials = this.toggleCredentials.bind(this);*/
    this.state = {
      user: "",
      dropdownOpen: false,
      value: 0, // value=1,administrator;value=2,instructor;value=3,student
      id: ""
    };
  }

  handleRole(event, index, value) {
    console.log(value);
    this.setState({
      value: value,
      signup: 0
    });
  }

  handleID(e,value) {
    console.log(e);
    console.log(value);
    this.setState({
      id: value
    });
  }

  handleClick() {
    console.log("Click happened");
    console.log(this.state.value);
    console.log(this.state.id);
    // Change this as well.
    let yourUrl =
      "https://tigrlcc7wb.execute-api.us-east-2.amazonaws.com/prod/updateData?role=" 
      + this.state.value + "&" + "uid=" + this.state.id;

    fetch(yourUrl, { mode: "no-cors" }).then(function(response) {
      console.log("Fetched ", yourUrl);
      console.log(response);
      console.log(response.body);
      console.log(response.headers);
    });
    this.routePage();
  }

  handleSignUp() {
    window.location = 'https://codecombat.com';
  }

  routePage() {
    if (this.state.value == 1) {
      setTimeout(function(){window.location = "#/administrator"},5000);  
    } else if (this.state.value == 2) {
      setTimeout(function(){window.location = "#/instructor"},5000);
    } else if (this.state.value == 3) {
      setTimeout(function(){window.location = "#/student"},5000);
    }
  }
  
  render() {
    console.log(this.state.value);
    return (
      <MuiThemeProvider>
        <div className="login-bg">
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
          <div className="landingbuttonfirst">
          <SelectField
            underlineFocusStyle={material_styles.underlineStyle}
            floatingLabelFocusStyle={material_styles.floatingLabelFocusStyle}
            floatingLabelText="Role"
            value={this.state.value}
            onChange={this.handleRole}
          >
            <MenuItem value={0} primaryText="Select Your Role" />
            <MenuItem value={1} primaryText="Administrator" />
            <MenuItem value={2} primaryText="Instructor" />
            <MenuItem value={3} primaryText="Student" />
          </SelectField>
          </div>
          <TextField
            underlineFocusStyle={material_styles.underlineStyle}
            floatingLabelFocusStyle={material_styles.floatingLabelFocusStyle}
            hintText="Your UserID"
            floatingLabelText="Enter Your UserID"
            onChange={this.handleID.bind(this)}
          />
        </Row>
        <Row className="justify-content-center landingbuttonrow">
          <div className="landingbuttonfirst">
            <div className="landingbutton" onClick={() => this.handleClick()}>LOGIN</div>
          </div>
          <div className="landingbuttonsecond">
          <div className="landingbutton" onClick={() => this.handleSignUp()}>SIGN UP</div>
          </div>
        </Row>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default Login;
