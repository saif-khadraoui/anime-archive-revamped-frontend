import React, { useState } from 'react'
import styles from "../../ui/register/register.module.css"
import { Link } from 'react-router-dom'
import Axios from "axios"

function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const attemptRegister = async (e) => {
    e.preventDefault()
    await Axios.post("https://anime-archive-revamped.onrender.com/api/register", {
      email: email,
      username: username,
      password: password
    }).then((response) => {
      console.log(response)
    })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={attemptRegister}>
        <div className={styles.input}>
          <p>Email</p>
          <input type='email' placeholder='Enter your email' value={email} onChange={((e) => setEmail(e.target.value))} />
        </div>
        <div className={styles.input}>
          <p>Username</p>
          <input type='text' placeholder='Enter a username' value={username} onChange={((e) => setUsername(e.target.value))} />
        </div>
        <div className={styles.input}>
          <p>Password</p>
          <input type='password' placeholder='Enter a password' value={password} onChange={((e) => setPassword(e.target.value))} />
        </div>
        <div className={styles.button}>
          <button type="submit">Register</button>
        </div>
        <p>Already a user?<Link to="/login">Login here</Link></p>
      </form>
    </div>
  )
}

export default Register