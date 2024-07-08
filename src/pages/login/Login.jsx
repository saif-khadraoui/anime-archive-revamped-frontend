import React, { useContext, useState } from 'react'
import styles from "../../ui/login/login.module.css"
import { Link } from 'react-router-dom'
import Axios from "axios"
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/User';

function Login() {
  const navigate = useNavigate()

  const [username, setUsernameValue] = useState("")
  const [password, setPassword] = useState("")

  const { setUserId, setUsername, setEmail, setProfilePic } = useContext(UserContext)


  const attemptLogin = async (e) => {
    e.preventDefault()
    await Axios.get("https://anime-archive-revamped.onrender.com/api/login", {
      params: { username, password }
    }).then((response) => {
      console.log(response)
      if(response.data.length > 0){
        // alert("logged in")
        setUserId(response.data[0]._id)
        setUsername(response.data[0].username)
        setEmail(response.data[0].email)
        setProfilePic(response.data[0].profilePic)
        navigate("/")
      }
    })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={attemptLogin}>
        <div className={styles.input}>
          <p>Username</p>
          <input type='text' placeholder='Enter a username' value={username} onChange={((e) => setUsernameValue(e.target.value))} />
        </div>
        <div className={styles.input}>
          <p>Password</p>
          <input type='password' placeholder='Enter a password' value={password} onChange={((e) => setPassword(e.target.value))} />
        </div>
        <div className={styles.button}>
          <button type="submit">Login</button>
        </div>
        <p>Not a user?<Link to="/register"> Register here</Link></p>
      </form>


    </div>
  )
}

export default Login