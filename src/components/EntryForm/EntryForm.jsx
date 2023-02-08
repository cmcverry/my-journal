import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../fireBaseConfig';
import './EntryForm.css';
import { onAuthStateChanged } from 'firebase/auth'
import axios from 'axios';


function EntryForm() {

    let userHeader = 'No user logged in.'
    if (auth.currentUser != null) {
        userHeader = `${auth.currentUser.displayName}'s Journal Entries`
    }
    
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        title : '',
        body : '',
        public : ''
    });
    const [showForm, setShowForm] = useState(false);
    const [showPostBtn, setShowPostBtn] = useState(false);
    const [showUser, setShowUser] = useState('No user loggied in.')
    const [errMessage, setErrMessage] = useState({
        value: ''
    })

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              setShowUser(`${auth.currentUser.displayName}'s Journal Entries`);
              setShowPostBtn(true);
            } else {
              setShowUser('No user loggied in.');
              setShowPostBtn(false);
              setShowForm(false);
            }
          });
    },[] );

    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    const handleClick = () => {
        if (showForm === false){
            setShowForm(true);
        } else {
            setShowForm(false);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        async function postEntry() {
            try {
                const response = await axios({
                    method: "post",
                    url: "/api/post/create",
                    data: {
                        title: formValue.title,
                        body: formValue.body,
                        username: auth.currentUser.displayName,
                        uid: auth.currentUser.uid,
                        public: formValue.public,
                    }
                });
                console.log(response);
                if (response.data === "no title") {
                    setErrMessage({value: "You must include a title."});
     
                } else if (response.data === "no body"){
                    setErrMessage({value: "You must include content."});
                }
                else {
                    handleClick();
                    // Refreshes page
                    navigate(0);
                }

            } catch (error) {
                console.log(error);
            }
        }
        console.log(formValue);
        postEntry();
    }

    return (
    <div className='entry-form'>
        <h1 className='user-header'>{showUser}</h1>
        <button className={`${!showPostBtn ? "active-btn" : ""} show-btn`} onClick={handleClick}>Make a new entry</button>
        <div className="entry-form-interior">
            <form onSubmit={handleSubmit} className={`${!showForm ? "active-form" : ""} show-form entry-form-box `}>
                <button onClick={handleClick} className="exit-btn">x</button>
                <h1>Post a journal entry:</h1>
                <label>Title</label>
                <br/>
                <input
                    type='text'
                    name='title'
                    value={formValue.title}
                    onChange={handleChange}
                />
                <br/>
                <label>Content</label>
                <br/>
                <textarea
                    name='body'
                    rows='10'
                    cols='75'
                    value={formValue.body}
                    onChange={handleChange}
                />
                <br/>
                <input 
                    type='checkbox'
                    name='public'
                    value='false'
                    // value={formValue.public}
                    onChange={handleChange}
                />
                <label>Private</label>
                <br/>
                <br/>
                <button type="submit"> 
                Submit Entry
                </button>
                <p className='error-message'>{errMessage.value}</p>
            </form>
        </div>
    </div>
    );
}

export default EntryForm;
