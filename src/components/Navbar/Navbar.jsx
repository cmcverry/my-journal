import './Navbar.css';
import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { auth, authOut } from '../../fireBaseConfig';
import { onAuthStateChanged } from 'firebase/auth'


function Navbar({ handleLoginClick }) {

  const [currentUser, setCurrentUser] = useState({
    email: '',
    msg: 'Not logged in',
    loginButton: 'Login'
  });

  // Listens for auth state change
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          email: user.email,
          msg: 'Logged in as ',
          loginButton: 'Logout'
        });
        console.log(user);
      } else {
        setCurrentUser({
          email: '',
          msg: 'Not logged in',
          loginButton: 'Login'
        });
      }
    });
  }, [currentUser.email]);

    const handleClick = () => {
      if (auth.currentUser != null) {
        authOut(auth);
      } else {
        handleLoginClick()
      }
    }

    return (
      <div className="header">
          <Link to='/' className="header-text"> My Journal </Link>
          <div className='links'>
            <p className='user-email'>{currentUser.msg} {currentUser.email}</p>
              <ul className="options">
                <li>
                  <button><Link to="/posts"> Visit User Journal</Link></button>
                </li>
                <li>
                  <button><Link to="/"> Latest Public Posts</Link></button>
                </li>
                <li> 
                  <button onClick={handleClick}>{currentUser.loginButton}</button>
                </li>
              </ul>
          </div>
      </div>
    );
  }
  
  export default Navbar;