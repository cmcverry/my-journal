import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authIn, auth } from '../../fireBaseConfig';
import { updateProfile } from 'firebase/auth';
import './SignUpForm.css';

function SignUpForm () {

    const navigate = useNavigate();

    const [formValue, setFormValue] = useState({
        email : '',
        username : '',
        password : '',
        passwordCheck : ''
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

    const handleSubmit = (event) => {
        event.preventDefault();
        async function signUp() {
            try {
                const response = await axios({
                    method: "post",
                    url: "/api/signup",
                    data: {
                        email: formValue.email,
                        username: formValue.username,
                        password: formValue.password,
                        passwordCheck: formValue.passwordCheck,
                    }
                });
                console.log(response);
                if (response.data === "Password") {
                    setErrMessage({value: "The entered passwords do not match."});
                    setFormValue({
                        ...formValue,
                        password : '',
                        passwordCheck : '',
                    });
                } else if (response.data === "Missing field"){
                    setErrMessage({value: "All input fields must be filled."});
   
                } else if (response.data === "Email in use") {
                    setErrMessage({value: "An account with this email already exists."});
                    setFormValue({
                        ...formValue,
                        email : '',
                    });

                } else if (response.data === "Invalid email") {
                    setErrMessage({value: "This is an invalid email."});
                    setFormValue({
                        ...formValue,
                        email : '',
                    });

                } else if (response.data === "Weak password") {
                    setErrMessage({value: "Password stength is too weak."});
                    setFormValue({
                        ...formValue,
                        password : '',
                        passwordCheck: ''
                    });

                } else {
                    setErrMessage({value: ""});
                    await authIn(auth, formValue.email, formValue.password);
                    await updateProfile(auth.currentUser, {
                        displayName: formValue.username,
                      }).then(() => {
                        // Profile updated!
                        // ...
                      }).catch((error) => {
                        // An error occurred
                        console.log(error);
                      });
                    try {
                        const response = await axios({
                            method: "post",
                            url: "/api/post/users",
                            data: {
                                email: auth.currentUser.email,
                                uid: auth.currentUser.uid,
                                username: auth.currentUser.displayName,
                            }
                        });
                        console.log(response);
                    } catch(error) {
                        console.log(error);
                    }
                    navigate("/posts", {replace: true});
                }
            } catch (error) {
                console.log(error);
            }
        }
        console.log(formValue);
        signUp();
    }

    return (
    <div className='signup-form'>
            <form onSubmit={handleSubmit} className='signup-form-box'>
                <h1>Sign Up</h1>
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
                <label>Username</label>
                <br/>
                <input
                    type='text'
                    name='username'
                    className='login-box'
                    value={formValue.username}
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
                <label>Re-enter Password</label>
                <br/>
                <input 
                    type='password'
                    name='passwordCheck'
                    className='login-box'
                    value={formValue.passwordCheck}
                    onChange={handleChange}
                />
                <br/>
                <button type="submit"> 
                Sign Up
                </button>
                <p className='error-message'>{errMessage.value}</p>
            </form>
    </div>
    );
}

export default SignUpForm;