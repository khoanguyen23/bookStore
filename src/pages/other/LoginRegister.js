import axios from "axios";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { fetchUser } from "../../redux/actions/authAction";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useHistory } from "react-router-dom";

const LoginForm = ({ submitHandler }) => {
  const { addToast } = useToasts();

  function onSubmitHandler(e) {
    e.preventDefault();
    // get fields of the form
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    // search for matching user from json-server
    // replace BACKEND_URL with your own json-server url
    const BACKEND_URL = "http://localhost:3001";
    axios
      .get(BACKEND_URL + "/users/", {
        params: {
          email,
          password,
        },
      })
      .then((res) => {
        const resUser = res.data[0];
        if (resUser) {
          addToast('Login successfully', { appearance: 'success', autoDismiss: true });
          const t = setTimeout(() => {
            submitHandler(resUser);
            clearTimeout(t);
          }, 1000);
        } else {
          addToast('Invalid credential', { appearance: 'error', autoDismiss: true });
        }
      })
      .catch((err) => {
        addToast(err.message, { appearance: 'error', autoDismiss: true });
      });
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        type="text"
        name="email"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
      />
      <div className="button-box">
        <div className="login-toggle-btn">
          <input type="checkbox" />
          <label className="ml-10">Remember me</label>
          <Link to={process.env.PUBLIC_URL + "/"}>
            Forgot Password?
          </Link>
        </div>
        <button type="submit">
          <span>Login</span>
        </button>
      </div>
    </form>
  );
}

const RegisterForm = ({ submitHandler }) => {
  const { addToast } = useToasts();

  function onSubmitHandler(e) {
    e.preventDefault();
    // get fields of the form
    const username = e.target.elements.username.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    const BACKEND_URL = "http://localhost:3001";
    axios
      .post(BACKEND_URL + "/users/", {
          username,
          email,
          password,
      })
      .then((res) => {
        const resUser = res.data;
        addToast('Register successfully', { appearance: 'success', autoDismiss: true });
        const t = setTimeout(() => {
          submitHandler(resUser);
          clearTimeout(t);
        }, 1000);
      })
      .catch((err) => {
        addToast(err.message, { appearance: 'error', autoDismiss: true });
      });
  }

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        type="text"
        name="username"
        placeholder="Username"
      />
      <input
        type="text"
        name="email"
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
      />
      <div className="button-box">
        <button type="submit">
          <span>Register</span>
        </button>
      </div>
    </form>
  );
}

const LoginRegister = ({ location, fetchUser }) => {
  const { pathname } = location;
  const history = useHistory();

  return (
    <Fragment>
      <MetaTags>
        <title>Flone | Login</title>
        <meta
          name="description"
          content="Compare page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Login Register
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ml-auto mr-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <LoginForm submitHandler={(user) => {
                              // console.log(user);
                              fetchUser(user);
                              history.push('/');
                            }} />
                          </div>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <RegisterForm submitHandler={(user) => {
                              // console.log(user);
                              fetchUser(user);
                              history.push('/');
                            }}/>
                          </div>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

LoginRegister.propTypes = {
  location: PropTypes.object,
  authData: PropTypes.object,
  fetchUser: PropTypes.func
};

const mapStateToProps = state => {
  return {
    auth: state.authData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: (user) => {
      dispatch(fetchUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);
