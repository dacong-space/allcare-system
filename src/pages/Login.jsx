import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Form, Input, Button, message, Checkbox, Tooltip } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import googleIcon from '../assets/icons/google.svg';
import appleIcon from '../assets/icons/apple.svg';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

// 样式组件
const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw; /* 确保宽度占满整个视口 */
  background-color: #f8f9fa;
  overflow: hidden;
  margin: 0; /* 移除可能的外边距 */
  padding: 0; /* 移除可能的内边距 */

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoginImageSection = styled.div`
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80');
  background-size: cover;
  background-position: center;
  position: relative;
  display: none;
  overflow: hidden; /* 防止内容溢出 */

  @media (min-width: 992px) {
    display: block;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(32, 32, 32, 0.7) 0%, rgba(32, 32, 32, 0.4) 100%);
  }
`;



const LoginFormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: white;

  @media (min-width: 992px) {
    max-width: 500px;
    padding: 40px 60px;
  }

  @media (max-width: 768px) {
    min-height: 100%;
  }
`;

const LoginForm = styled.div`
  width: 100%;
  max-width: 400px;
`;

const LoginHeader = styled.div`
  margin-bottom: 30px;
  text-align: left;
  width: 100%;
`;

const WelcomeTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #555; /* 增强对比度，使用更深的灰色 */
  margin-bottom: 40px;
`;

const FormLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    padding: 14px 16px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    background-color: white;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    height: 50px;

    &:hover {
      border-color: #4169e1;
      box-shadow: 0 2px 8px rgba(65, 105, 225, 0.15);
    }

    &:focus, &-focused {
      border-color: #4169e1;
      box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.2);
      outline: none;
    }
  }

  .ant-input {
    font-size: 16px;

    &:focus {
      box-shadow: none;
    }

    &::placeholder {
      color: #bbb;
    }
  }

  .ant-btn {
    height: 50px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    transition: all 0.3s ease;
  }

  .login-button {
    background: #3e6c45;
    border: none;
    margin-top: 10px;
    position: relative;
    overflow: hidden;

    &:hover {
      background: #3e6c45 !important; /* 保持相同的绿色 */
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(62, 108, 69, 0.3);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(62, 108, 69, 0.3);
    }

    &:focus {
      background: #3e6c45 !important;
    }
  }

  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #e8e8e8;
    color: #333;
    background: white;

    &:hover {
      border-color: #ddd;
      background: #f9f9f9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const ForgotPassword = styled.a`
  color: #3051b5; /* 增强对比度，使用更深的蓝色 */
  font-size: 14px;
  font-weight: 500; /* 增加字重 */
  text-align: right;
  display: block;
  margin-bottom: 20px;

  &:hover {
    text-decoration: underline;
    color: #1a3aa1; /* 悬停时使用更深的颜色 */
  }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .ant-checkbox-wrapper {
    color: #555; /* 增强对比度，使用更深的灰色 */
    font-size: 14px;
    font-weight: 500; /* 增加字重 */
  }
`;



const OrDivider = styled.div`
  text-align: center;
  color: #999;
  font-size: 14px;
  margin: 20px 0;
  position: relative;

  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #e8e8e8;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
`;

const SignUpText = styled.div`
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #555; /* 增强对比度，使用更深的灰色 */

  a {
    color: #3051b5; /* 与忘记密码链接保持一致 */
    font-weight: 500;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
      color: #1a3aa1; /* 悬停时使用更深的颜色 */
    }
  }
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 如果已经登录，始终重定向到首页
  useEffect(() => {
    // 只有在认证状态加载完成后才进行重定向
    if (!isLoading && isAuthenticated) {
      // 始终重定向到首页，不考虑之前的路径
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 模拟登录
  const handleLogin = (values) => {
    setLoading(true);
    setLoginError('');

    // 这里应该是实际的API调用，现在我们模拟一个成功的登录
    setTimeout(() => {
      try {
        // 模拟用户数据和令牌
        const userData = {
          id: 1,
          username: values.username,
          name: '管理员/Admin',
          role: 'admin',
        };
        const token = 'mock-jwt-token';

        login(userData, token);
        message.success('登录成功！');
        // 始终导航到首页
        navigate('/', { replace: true });
      } catch (error) {
        setLoginError('登录失败，请检查您的用户名和密码');
        message.error('登录失败，请检查您的用户名和密码');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // 切换密码可见性
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // 如果还在加载中，不显示任何内容
  if (isLoading) {
    return null;
  }

  return (
    <LoginContainer>
      <LoginImageSection>
        {/* 只保留背景图片，不需要文字内容 */}
      </LoginImageSection>

      <LoginFormSection>
        <LoginForm>
          <LoginHeader>
            <WelcomeTitle>Welcome back!</WelcomeTitle>
            <WelcomeSubtitle>Enter your Credentials to access your account</WelcomeSubtitle>
          </LoginHeader>

          <StyledForm
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            layout="vertical"
            size="large"
          >
            <FormLabel>Email address</FormLabel>
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入邮箱地址' }]}
            >
              <Input
                placeholder="Enter your email"
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <FormLabel>Password</FormLabel>
              <ForgotPassword href="#">Forgot password</ForgotPassword>
            </div>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: togglePasswordVisibility }}
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            {loginError && (
              <div style={{ color: '#ff4d4f', marginBottom: '16px', fontSize: '14px' }}>
                {loginError}
              </div>
            )}

            <RememberMeContainer>
              <Checkbox>Remember for 30 days</Checkbox>
              <Tooltip title="系统将保存您的登录状态，30天内无需再次输入账号密码">
                <QuestionCircleOutlined style={{ color: '#999', marginLeft: '8px', fontSize: '14px', cursor: 'pointer' }} />
              </Tooltip>
            </RememberMeContainer>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-button"
                style={{ background: '#3e6c45', borderColor: '#3e6c45' }}
              >
                {loading ? 'Signing In...' : 'Login'}
              </Button>
            </Form.Item>

            <OrDivider>Or</OrDivider>

            <SocialButtonsContainer>
              <Button
                className="social-button"
                style={{ flex: 1 }}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const userData = {
                      id: 1,
                      username: 'google-user',
                      name: 'Google User',
                      role: 'user',
                    };
                    const token = 'mock-jwt-token';
                    login(userData, token);
                    message.success('登录成功！');
                    navigate('/');
                    setLoading(false);
                  }, 800);
                }}
                disabled={loading}
              >
                <img src={googleIcon} alt="Google" />
                Sign in with Google
              </Button>
            </SocialButtonsContainer>

            <SocialButtonsContainer style={{ marginTop: '12px' }}>
              <Button
                className="social-button"
                style={{ flex: 1 }}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    const userData = {
                      id: 1,
                      username: 'apple-user',
                      name: 'Apple User',
                      role: 'user',
                    };
                    const token = 'mock-jwt-token';
                    login(userData, token);
                    message.success('登录成功！');
                    navigate('/');
                    setLoading(false);
                  }, 800);
                }}
                disabled={loading}
              >
                <img src={appleIcon} alt="Apple" />
                Sign in with Apple
              </Button>
            </SocialButtonsContainer>

            <SignUpText>
              Don't have an account? <a href="#">Sign Up</a>
            </SignUpText>

            {/* 跳过登录按钮 - 仅用于开发测试 */}
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  const userData = {
                    id: 1,
                    username: 'admin',
                    name: 'Admin User',
                    role: 'admin',
                  };
                  const token = 'mock-jwt-token';
                  login(userData, token);
                  message.success('跳过登录成功！');
                  navigate('/');
                }}
                style={{ fontSize: '12px', color: '#999' }}
              >
                跳过登录(仅用于测试)
              </Button>
            </div>
          </StyledForm>
        </LoginForm>
      </LoginFormSection>
    </LoginContainer>
  );
};

export default Login;
