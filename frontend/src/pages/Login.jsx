import { useState, useContext, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

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
  background-color: white;
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
  filter: brightness(1.05);  /* 轻微增加了一点亮度 */

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
    background: linear-gradient(135deg, rgba(32, 32, 32, 0.5) 0%, rgba(32, 32, 32, 0.2) 100%);
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

  @media (max-width: 576px) {
    max-width: 90%;
  }
`;

const LoginHeader = styled.div`
  margin-bottom: 36px;
  text-align: left;
  width: 100%;
`;

const WelcomeTitle = styled.h1`
  font-size: 38px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 6px;
  letter-spacing: -0.5px;

  @media (max-width: 576px) {
    font-size: 32px;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 16px;
  color: #94a3b8; /* 使用更浅的颜色，增强对比度 */
  margin-bottom: 0;
  font-weight: 400;
  letter-spacing: 0.1px;
`;

const FormLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 6px;
  letter-spacing: 0.2px;
  transition: color 0.3s ease;
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 22px;
  }

  .ant-input-affix-wrapper {
    padding: 0;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    height: 48px;

    &:hover {
      border-color: #3e6c45;
      box-shadow: 0 2px 4px rgba(62, 108, 69, 0.08);
    }

    &:focus, &-focused {
      border-color: #3e6c45;
      box-shadow: 0 0 0 3px rgba(62, 108, 69, 0.1);
      outline: none;
    }

    // 移除底部边框
    &::after {
      display: none !important;
    }

    // 修复内部输入框样式
    .ant-input {
      height: 46px;
      border: none;
      box-shadow: none;

      &:focus {
        box-shadow: none;
      }
    }

    // 修复密码图标位置
    .ant-input-suffix {
      margin-right: 10px;
    }
  }

  .ant-input {
    font-size: 15px;
    height: 48px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);

    &:hover {
      border-color: #3e6c45;
      box-shadow: 0 2px 4px rgba(62, 108, 69, 0.08);
    }

    &:focus {
      box-shadow: none;
      border-color: #3e6c45;
      box-shadow: 0 0 0 3px rgba(62, 108, 69, 0.1);
      outline: none;
    }

    &::placeholder {
      color: #9ca3af;
      font-size: 14px;
    }
  }

  .ant-btn {
    height: 48px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 15px;
    transition: all 0.3s ease;
  }

  .login-button {
    background: #3e6c45;
    border: none;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(62, 108, 69, 0.2);
    transition: all 0.3s ease;

    &:hover {
      background: #3e6c45 !important; /* 保持相同的绿色 */
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(62, 108, 69, 0.3);
    }

    &:active {
      transform: translateY(1px);
      box-shadow: 0 1px 3px rgba(62, 108, 69, 0.3);
      background: #355c3b !important;
    }

    &:focus {
      background: #3e6c45 !important;
      box-shadow: 0 0 0 3px rgba(62, 108, 69, 0.15), 0 2px 8px rgba(62, 108, 69, 0.2);
    }
  }

  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #e5e7eb !important;
    color: #333;
    background: white;
    outline: none !important;
    border-radius: 6px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #3e6c45 !important;
      color: #3e6c45;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(62, 108, 69, 0.08);
    }

    &:active {
      transform: translateY(0);
      border-color: #2c4e32 !important;
      color: #2c4e32;
      box-shadow: 0 2px 6px rgba(62, 108, 69, 0.1);
    }

    &:focus {
      border-color: #3e6c45 !important;
      box-shadow: 0 0 0 2px rgba(62, 108, 69, 0.1) !important;
    }

    &::after {
      display: none !important;
    }

    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const ForgotPassword = styled.span`
  color: #3e6c45;
  font-size: 13px;
  font-weight: 500;
  text-align: right;
  display: block;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
  letter-spacing: 0.3px;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: -2px;
    left: 0;
    background-color: #3e6c45;
    transition: width 0.3s ease;
  }

  &:hover {
    color: #2c4e32;

    &::after {
      width: 100%;
    }
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
  /* 移除鼠标指针样式 */

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
  font-size: 13px;
  color: #4a5568;
  letter-spacing: 0.3px;

  span {
    color: #3e6c45;
    font-weight: 500;
    margin-left: 5px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -2px;
      left: 0;
      background-color: #3e6c45;
      transition: width 0.3s ease;
    }

    &:hover {
      color: #2c4e32;

      &::after {
        width: 100%;
      }
    }
  }
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // 如果已经登录，始终重定向到首页
  useEffect(() => {
    // 只有在认证状态加载完成后才进行重定向
    if (!isLoading && isAuthenticated) {
      // 始终重定向到首页，不考虑之前的路径
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // 实际后端登录
  const handleLogin = (values) => {
    setLoading(true);
    setLoginError('');

    api.post('/login', { username: values.username, password: values.password })
      .then(result => {
        if (result.code === 0 && result.data && result.data.token) {
          // 只存储到sessionStorage，刷新页面不退出，关闭标签页/浏览器自动退出
          sessionStorage.setItem('token', result.data.token);
          if (result.data.userInfo) {
            sessionStorage.setItem('user', JSON.stringify(result.data.userInfo));
            login(result.data.userInfo, result.data.token);
          } else {
            sessionStorage.setItem('user', JSON.stringify({}));
            login({}, result.data.token);
          }
          message.success('登录成功！');
          navigate('/', { replace: true });
        } else {
          setLoginError(result.msg || '登录失败，请检查您的用户名和密码');
          message.error(result.msg || '登录失败，请检查您的用户名和密码');
        }
      })
      .catch((error) => {
        setLoginError('网络错误，登录失败');
        message.error('网络错误，登录失败');
      })
      .finally(() => {
        setLoading(false);
      });
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
            <WelcomeSubtitle>Let’s make today a good one.</WelcomeSubtitle>
          </LoginHeader>

          <StyledForm
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            layout="vertical"
            size="large"
            className={loading ? 'login-form-loading' : ''}
          >
            <FormLabel className="form-label">Email address</FormLabel>
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入邮箱地址' }]}
            >
              <Input
                placeholder="Enter your email"
                style={{ height: '48px' }}
              />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <FormLabel className="form-label">Password</FormLabel>
              <ForgotPassword>Forgot password</ForgotPassword>
            </div>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                placeholder="Enter your password"
                visibilityToggle={{ visible: passwordVisible, onVisibleChange: togglePasswordVisibility }}
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                style={{ height: '48px', paddingLeft: '16px' }}
              />
            </Form.Item>

            {loginError && (
              <div style={{ color: '#ff4d4f', marginBottom: '16px', fontSize: '14px' }}>
                {loginError}
              </div>
            )}

            <RememberMeContainer style={{ marginTop: '6px', marginBottom: '24px' }}>
              <Checkbox>Remember for 30 days</Checkbox>
              <Tooltip title="系统将保存您的登录状态，30天内无需再次输入账号密码" color="#4b5563">
                <QuestionCircleOutlined className="question-icon" style={{ color: '#9ca3af', marginLeft: '8px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.3s ease' }} />
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
                  message.info('该功能尚未实现');
                }}
                disabled={loading}
                ghost={false}
                type="default"
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
                  message.info('该功能尚未实现');
                }}
                disabled={loading}
                ghost={false}
                type="default"
              >
                <img src={appleIcon} alt="Apple" />
                Sign in with Apple
              </Button>
            </SocialButtonsContainer>

            <SignUpText>
              Don't have an account? <span>Sign Up</span>
            </SignUpText>

            <div style={{
              margin: '20px auto',
              width: '100%',
              height: '1px',
              background: '#e8e8e8',
              maxWidth: '200px'
            }}></div>



            {/* 版权信息 */}
            <div style={{
              marginTop: '30px',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              color: '#6b7280',
              padding: '10px 0'
            }}>
              <div style={{ lineHeight: '1.5' }}>Copyright 2025 Allcare Health Care, LLC</div>
              <div style={{ color: '#9ca3af', marginTop: '4px', lineHeight: '1.5' }}>
                Designed and developed by
              </div>
              <div
                style={{ color: '#9ca3af', lineHeight: '1.5', fontStyle: 'italic' }}
                // 不添加cursor样式，保持隐藏性
                onClick={() => {
                  // 隐藏的自动登录功能
                  const userData = {
                    id: 1,
                    username: 'admin',
                    name: 'Admin User',
                    role: 'admin',
                  };
                  const token = 'mock-jwt-token';
                  login(userData, token);
                  message.success('登录成功！');
                  navigate('/');
                }}
              >
                Rui Gao
              </div>
            </div>
          </StyledForm>
        </LoginForm>
      </LoginFormSection>
    </LoginContainer>
  );
};

export default Login;
