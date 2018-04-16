import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Nav,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Badge
} from 'reactstrap';
import HeaderDropdown from './HeaderDropdown';

import firebase from '../../firebase';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      mount: false
    }
  }

  componentDidMount() {
    const db = firebase.database();
    db.ref('/userName').on('value', (snapshot) => {
      var username = snapshot.val();
      console.log(username);
      this.setState({
        name: username['name'],
        mount: true
      })
    })
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    if (this.state.mount === true) {
      return (
        <header className="app-header navbar">
          <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
            <span className="navbar-toggler-icon"></span>
          </NavbarToggler>
          <NavbarToggler className="d-md-down-none" onClick={this.sidebarToggle}>
            <span className="navbar-toggler-icon"></span>
          </NavbarToggler>
          <Nav className="d-md-down-none" navbar>
            <NavItem className="px-3">
              Welcome to 007Analytics, <strong>{this.state.name}</strong>!
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavItem className="d-md-down-none">
              <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">7</Badge></NavLink>
            </NavItem>
            <HeaderDropdown/>
          </Nav>
          <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
            <span className="navbar-toggler-icon"></span>
          </NavbarToggler>
        </header>
      );
    } else {
      return null;
    }
  }
}

export default Header;
