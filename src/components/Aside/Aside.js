import React, {Component} from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink, Progress, Label, Input} from 'reactstrap';
import classnames from 'classnames';

class Aside extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <aside className="aside-menu">
        <Nav tabs>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '1' })}
                     onClick={() => { this.toggle('1'); }}>
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '2' })}
                     onClick={() => { this.toggle('2'); }}>
              <i className="icon-speech"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '3' })}
                     onClick={() => { this.toggle('3'); }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <div className="callout m-0 py-2 text-muted text-center bg-light text-uppercase">
              <small><b>Upcoming Classes</b></small>
            </div>
            <hr className="transparent mx-3 my-0"/>
            <div className="callout callout-warning m-0 py-3">
              <div className="avatar float-right">
                <img src={'img/flags/Singapore.png'} className="img-avatar"/>
              </div>
              <div>Enrichment Class on <strong>JavaScript Essentials</strong></div>
              <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 5th May 2018, 1 - 3pm</small>
              <small className="text-muted"><i className="icon-location-pin"></i>&nbsp; NUS SOC COM1, 02-13</small>
              <div className="avatars-stack mt-2">
                <div className="avatar avatar-xs">
                  <img src={'img/avatars/2.jpg'} className="img-avatar"/>
                </div>
                <div className="avatar avatar-xs">
                  <img src={'img/avatars/3.jpg'} className="img-avatar"/>
                </div>
                <div className="avatar avatar-xs">
                  <img src={'img/avatars/4.jpg'} className="img-avatar"/>
                </div>
                <div className="avatar avatar-xs">
                  <img src={'img/avatars/5.jpg'} className="img-avatar"/>
                </div>
                <div className="avatar avatar-xs">
                  <img src={'img/avatars/6.jpg'} className="img-avatar"/>
                </div>
              </div>
            </div>
            <hr className="mx-3 my-0"/>
            <div className="callout callout-info m-0 py-3">
              <div className="avatar float-right">
                <img src={'img/flags/Singapore.png'} className="img-avatar"/>
              </div>
              <div>Enrichment Class on <strong>AWS Lambda</strong></div>
              <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 10th June 2018, 4 - 5pm</small>
              <small className="text-muted"><i className="icon-social-pin"></i>&nbsp; NUS SOC COM1, 02-13</small>
              
            </div>
            <hr className="transparent mx-3 my-0"/>
            <div className="callout m-0 py-2 text-muted text-center bg-light text-uppercase">
              <small><b>Past Classes</b></small>
            </div>
            <hr className="transparent mx-3 my-0"/>
            <div className="callout callout-danger m-0 py-3">
              <div>Enrichment Class on <strong>Callbacks & Promises</strong></div>
              <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 2nd Jan 2018, 10 - 11pm</small>
            </div>
            <hr className="mx-3 my-0"/>
            <div className="callout callout-success m-0 py-3">
              <div>Introduction Class to <strong>React & Redux Framework</strong></div>
              <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 10th December 2017, 1 - 3pm</small>
            </div>
            <hr className="mx-3 my-0"/>
          </TabPane>
          <TabPane tabId="2" className="p-3">
            <hr/>
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'img/flags/Singapore.png'} className="img-avatar"/>
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">ALSET Team</small>
                <small className="text-muted float-right mt-1">30 March 1:32 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">National Coding Championships 2018</div>
              <small className="text-muted">Thank you to all that participated in the National Coding Competition! Well done!
              </small>
            </div>
            <hr/>
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'img/flags/Singapore.png'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">ALSET Team</small>
                <small className="text-muted float-right mt-1">29 March 5:08 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">1 Day to Competition!</div>
              <small className="text-muted">We're 1 day away from the competitions and we wish all teams the best of luck and see you tomorrow!
              </small>
            </div>
            <hr/>
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'img/flags/Singapore.png'} className="img-avatar" alt="admin@bootstrapmaster.com"/>
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">ALSET Team</small>
                <small className="text-muted float-right mt-1">16 March 4:37 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Sign-up now!</div>
              <small className="text-muted">The top 12 secondary schools qualify to send a team to the 2018 National Coding Championships finals. 
                Link: <div href="http://bit.ly/2018NCC">http://bit.ly/2018NCC</div>
              </small>
            </div>
          </TabPane>
          <TabPane tabId="3" className="p-3">
            <h6>Settings</h6>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Notifications</b></small>
                <Label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <Input type="checkbox" className="switch-input" defaultChecked/>
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </Label>
              </div>
              <div>
                <small className="text-muted">Allow push notifications to your devices.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Data Collection</b></small>
                <Label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <Input type="checkbox" className="switch-input"/>
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </Label>
              </div>
              <div>
                <small className="text-muted">Allow us to collect your personal information for analytics purposes.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Newsletter Subscription</b></small>
                <Label className="switch switch-text switch-pill switch-success switch-sm float-right">
                  <Input type="checkbox" className="switch-input"/>
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </Label>
              </div>
              <div>
                <small className="text-muted">Subscribe to our latest updates and news on Achievements App and 007Analytics.
                </small>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </aside>
    )
  }
}

export default Aside;
