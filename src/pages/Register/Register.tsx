import RegisterForm from '../../components/Register/RegisterForm'
import './registerpage.css'

const Register =() => {
  return (
    <div className='register_container'>
      <div className='register_form'>
        <h1 className='register_heading'>Register</h1>
        <div>
          <RegisterForm/>
        </div>
      </div>
    </div>
  )
}

export default Register

