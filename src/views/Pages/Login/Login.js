import React, {Component} from 'react';
import {Container, Row, Col, CardGroup, Card, CardBody, Button, Input, InputGroup, InputGroupAddon, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import firebase from '../../../firebase';

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

  // use componentWillMount to initialize firebase here
  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.setState({
        user: nextProps.user
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.user !== this.state.user) {
      this.setState({
        user: this.state.user
      });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
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
                    <InputGroup className="mb-3">
                      <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                      <Input type="text" placeholder="Username"/>
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                      <Input type="password" placeholder="Password"/>
                    </InputGroup>
                    <Row>
                      <Col xs="6">
                        <Button color="primary" onClick={() => this.routePage()} className="px-4">Login</Button>
                      </Col>
                      <Col xs="6" className="text-right">
                        <Button color="link" className="px-0">Forgot password?</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Don't have an account? Sign up today!</p>
                      <Button color="primary" className="mt-3" active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
