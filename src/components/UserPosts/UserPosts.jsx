import {useState, useEffect, } from 'react';
import { auth } from '../../fireBaseConfig';
import './UserPosts.css';
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function UserPosts() {

    const navigate = useNavigate();

    const [showDeletePopup, setDeletePopup] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [posts, setPosts] = useState(null)
    const [errMessage, setErrMessage] = useState({
        value: ''
    })
    const [formValue, setFormValue] = useState({
        title : '',
        body : '',
        public : '',
        pid: ''
    });
    const [showForm, setShowForm] = useState(false);


    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setFormValue({
            ...formValue,
            [name]: value
        });
    }

    const handleEditClick = () => {
        setShowForm((showForm) => !showForm);
    }

    const fillForm = (post) => {
        setFormValue({
            ...formValue,
            title: post.title,
            body : post.body,
            pid : post.pid
        });
    }

    const handleEditClickWrapper = (post) => {
        fillForm(post);
        handleEditClick();
    }

    const handleDeleteClick = () => {
        setDeletePopup((showDeletePopup) => !showDeletePopup);
    }

    const selectDeletePost = (pid) => {
        console.log(pid);
        setPostToDelete(pid);
        // console.log(postToDelete);
    }

    const handleDeleteClickWrapper = (pid) => {
        handleDeleteClick();
        selectDeletePost(pid);
    }

    const handleDeletePost = () => {
        async function deletePost() {
            try {
                const response = await axios({
                    method: "delete",
                    url: "/api/delete/post",
                    data: {
                        post_id: postToDelete,
                        uid: auth.currentUser.uid
                    }
                });
                console.log(response);
                if (response.data === "no title") {
                    setErrMessage({value: "You must include a title."});
     
                } else if (response.data === "no body"){
                    setErrMessage({value: "You must include content."});
                }
                else {
                    // handleEditClick();
                    // Refreshes page
                    navigate(0);
                }

            } catch (error) {
                console.log(error);
            }
        }
        // console.log(formValue);
        deletePost();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        async function editEntry() {
            try {
                const response = await axios({
                    method: "put",
                    url: "/api/put/post",
                    data: {
                        title: formValue.title,
                        body: formValue.body,
                        pid: formValue.pid,
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
                    handleEditClick();
                    // Refreshes page
                    navigate(0);
                }

            } catch (error) {
                console.log(error);
            }
        }
        console.log(formValue);
        editEntry();
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
            getUserPosts(user.uid);
            } else {
            setDeletePopup(false);
            setPosts(null);
            }
        });
    },[] );

    const getUserPosts = async (uid) => {
        try {
            console.log(uid);
            const response = await axios({
                method: "post",
                url: "/api/get/userPosts",
                data: {
                    user_id: uid,
                }
            });
            console.log(response);
            setPosts(response.data);

        } catch (error) {
            console.log(error);
        }
    }

    if (posts != null) {
        return (
            <div className="user-post-container">
                <div className={`${!showDeletePopup ? "active" : ""} delete-popup`}>
                    <p>Are you sure you want to delete this post?</p>
                    <button onClick={handleDeletePost}>Yes</button>
                    <button onClick={handleDeleteClick}>No</button>
                </div>
                {/* <div className="edit-form-interior"> */}
                    <form onSubmit={handleSubmit} className={`${!showForm ? "active-edit-form" : ""} show-edit-form edit-form-box `}>
                        <button onClick={handleEditClick} className="exit-btn">x</button>
                        <h1>Edit this journal entry:</h1>
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
                            onChange={handleChange}
                        />
                        <label>Private</label>
                        <br/>
                        <br/>
                        <button type="submit"> 
                        Edit Entry
                        </button>
                        <p className='error-message'>{errMessage.value}</p>
                    </form>
                {/* </div> */}

                <ul className="user-posts">
                {posts.map((post, index) => {
                    let visibility, date;
                    if (post.public){ 
                        visibility = "public";
                    }
                    else {
                        visibility = "private";
                    }
                    if (post.edited != null){
                        date = "Edited on: " + post.edited;
                    }
                    else {
                        date = "Posted on: " + post.date_created;
                    }

                    return (
                    <li className="user-post" key={index}>
                        <h3>{post.title}</h3>
                        <h5>{date}</h5>
                        <br/>
                        {post.body}
                        <br/>
                        <br/>
                        <h5>{visibility}</h5>
                        <button onClick={() => handleDeleteClickWrapper(post.pid)}>Delete</button>
                        <button onClick={() => handleEditClickWrapper(post)}>Edit</button>
                    </li>
                    )
                })}
                </ul>
            </div>
        );
    } else {
        return (
            <div className="user-post-container">
                <p>...</p>
            </div>
        )
            
    }
}

export default UserPosts;