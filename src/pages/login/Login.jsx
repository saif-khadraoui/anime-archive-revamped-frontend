import React, { useContext, useState } from 'react'
import styles from "../../ui/login/login.module.css"
import { Link } from 'react-router-dom'
import Axios from "axios"
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/User';
import { MdEmail, MdLock, MdPerson, MdLogin, MdError } from "react-icons/md";

function Login() {
  const navigate = useNavigate()

  const [username, setUsernameValue] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const { setUserId, setUsername, setEmail, setProfilePic } = useContext(UserContext)


  const attemptLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")
    
    try {
      const response = await Axios.get("https://anime-archive-revamped.onrender.com/api/login", {
        params: { username, password }
      })
      
      console.log(response)
      if(response.data.length > 0){
        setUserId(response.data[0]._id)
        setUsername(response.data[0].username)
        setEmail(response.data[0].email)
        setProfilePic(response.data[0].profilePic)
        navigate("/")
      } else {
        setErrorMessage("Invalid username or password. Please try again.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setErrorMessage("Invalid username or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <MdLogin size={48} />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        
        {errorMessage && (
          <div className={styles.errorMessage}>
            <MdError size={20} />
            <span>{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={attemptLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <div className={styles.inputContainer}>
              <MdPerson className={styles.inputIcon} />
              <input 
                id="username"
                type='text' 
                placeholder='Enter your username' 
                value={username} 
                onChange={(e) => setUsernameValue(e.target.value)}
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
                placeholder='Enter your password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            <MdLogin size={20} />
            {loading ? "Signing In..." : "Sign In"}
          </button>
          
          <div className={styles.footer}>
            <p>Don't have an account? <Link to="/register" className={styles.link}>Sign up here</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login