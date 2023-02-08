import { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { auth, authIn } from '../../fireBaseConfig';


function Login ({ showLogin, handleLoginClick }) {

    const [formValue, setFormValue] = useState({
        email : '',
        password : ''
    });

    const [errMessage, setErrMessage] = useState({
        value: ''
    })

    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let loginAttempt = await authIn(auth, formValue.email, formValue.password);
        if (loginAttempt === 'auth/invalid-email' || loginAttempt === 'auth/wrong-password') {
            setErrMessage({value: 'Invalid email or password.'});
            setFormValue({
                ...formValue,
                email: '',
                password: '',
            });
        } else if (loginAttempt === 'auth/user-not-found') {
            setErrMessage({value: 'No user with this email exists.'});
            setFormValue({
                ...formValue,
                email: '',
                password: '',
            }); 
        } else {
            handleLoginClick();
            setErrMessage({value: ''});
            setFormValue({
                ...formValue,
                email: '',
                password: '',
            });
        }
    }

    const handleClick = () => {
        handleLoginClick()
      }

    return (
        
        <div className={`${!showLogin ? "active" : ""} show`}>
            <div className='login-form'>
                <div className= 'login-form-interior'>
                    <button className='exit-btn' onClick={handleClick}>X</button>
                    <form onSubmit={handleSubmit} className='form-box'>
                        <h1>Login</h1>
                        <label>Email</label>
                        <br/>
                        <input
                            type='email'
                            name='email'
                            className='login-box'
                            value={formValue.email}
                            onChange={handleChange}
                        />
                        <br/>
                        <label>Password</label>
                        <br/>
                        <input 
                            type='password'
                            name='password'
                            className='login-box'
                            value={formValue.password}
                            onChange={handleChange}
                        />
                        <br/>
                        <input type="submit" value="Login"
                        />
                        <p>New User? <Link onClick={handleClick} to="/signup"> Sign up here</Link></p>
                        <p className='error-message'>{errMessage.value}</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;