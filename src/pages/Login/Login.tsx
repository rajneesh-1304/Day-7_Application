import LoginForm from '../../components/Login/LoginForm'
import './login.css';

const Login = () => {
  return (
    <div className='login_container'>
      <div className='login_form'>
        <h1 className='login_heading'>Login</h1>
        <div>
          <LoginForm/>
        </div>
      
      </div>
    </div>
  )
}

export default Login
