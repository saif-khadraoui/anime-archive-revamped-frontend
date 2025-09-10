import React, { useState } from 'react'
import styles from "../../ui/register/register.module.css"
import { Link } from 'react-router-dom'
import Axios from "axios"
import { MdEmail, MdLock, MdPerson, MdPersonAdd } from "react-icons/md";

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
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <MdPersonAdd size={48} />
          </div>
          <h1>Create Account</h1>
          <p>Join us and start your anime journey</p>
        </div>
        
        <form onSubmit={attemptRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputContainer}>
              <MdEmail className={styles.inputIcon} />
              <input 
                id="email"
                type='email' 
                placeholder='Enter your email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <div className={styles.inputContainer}>
              <MdPerson className={styles.inputIcon} />
              <input 
                id="username"
                type='text' 
                placeholder='Choose a username' 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputContainer}>
              <MdLock className={styles.inputIcon} />
              <input 
                id="password"
                type='password' 
                placeholder='Create a password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className={styles.submitButton}>
            <MdPersonAdd size={20} />
            Create Account
          </button>
          
          <div className={styles.footer}>
            <p>Already have an account? <Link to="/login" className={styles.link}>Sign in here</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register