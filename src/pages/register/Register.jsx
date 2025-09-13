import React, { useState } from 'react'
import styles from "../../ui/register/register.module.css"
import { Link, useNavigate } from 'react-router-dom'
import Axios from "axios"
import { MdEmail, MdLock, MdPerson, MdPersonAdd, MdCheckCircle, MdError } from "react-icons/md";

function Register() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("") // "success" or "error"
  const [emailError, setEmailError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("Email is required")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    } else {
      setEmailError("")
      return true
    }
  }

  const validateUsername = (username) => {
    if (!username) {
      setUsernameError("Username is required")
      return false
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long")
      return false
    } else if (username.length > 20) {
      setUsernameError("Username must be less than 20 characters")
      return false
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError("Username can only contain letters, numbers, and underscores")
      return false
    } else {
      setUsernameError("")
      return true
    }
  }

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required")
      return false
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return false
    } else {
      setPasswordError("")
      return true
    }
  }

  const attemptRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    setMessageType("")
    
    // Clear previous validation errors
    setEmailError("")
    setUsernameError("")
    setPasswordError("")
    
    // Validate all fields
    const isEmailValid = validateEmail(email)
    const isUsernameValid = validateUsername(username)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isUsernameValid || !isPasswordValid) {
      setLoading(false)
      return
    }
    
    try {
      const response = await Axios.post("https://anime-archive-revamped.onrender.com/api/register", {
        email: email,
        username: username,
        password: password
      })
      
      console.log(response)
      
      if (response.data.success) {
        setMessage("Account created successfully! Redirecting to login...")
        setMessageType("success")
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        setMessage(response.data.message || "Registration failed. Please try again.")
        setMessageType("error")
      }
      
    } catch (error) {
      console.error("Registration error:", error)
      if (error.response?.data?.message) {
        setMessage(error.response.data.message)
      } else {
        setMessage("Registration failed. Please try again.")
      }
      setMessageType("error")
    } finally {
      setLoading(false)
    }
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
        
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {messageType === "success" ? (
              <MdCheckCircle size={20} />
            ) : (
              <MdError size={20} />
            )}
            <span>{message}</span>
          </div>
        )}
        
        <form onSubmit={attemptRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={`${styles.inputContainer} ${emailError ? styles.error : ''}`}>
              <MdEmail className={styles.inputIcon} />
              <input 
                id="email"
                type='email' 
                placeholder='Enter your email' 
                value={email} 
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) validateEmail(e.target.value)
                }}
                onBlur={() => validateEmail(email)}
                required
              />
            </div>
            {emailError && <span className={styles.fieldError}>{emailError}</span>}
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <div className={`${styles.inputContainer} ${usernameError ? styles.error : ''}`}>
              <MdPerson className={styles.inputIcon} />
              <input 
                id="username"
                type='text' 
                placeholder='Choose a username' 
                value={username} 
                onChange={(e) => {
                  setUsername(e.target.value)
                  if (usernameError) validateUsername(e.target.value)
                }}
                onBlur={() => validateUsername(username)}
                required
              />
            </div>
            {usernameError && <span className={styles.fieldError}>{usernameError}</span>}
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={`${styles.inputContainer} ${passwordError ? styles.error : ''}`}>
              <MdLock className={styles.inputIcon} />
              <input 
                id="password"
                type='password' 
                placeholder='Create a password' 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (passwordError) validatePassword(e.target.value)
                }}
                onBlur={() => validatePassword(password)}
                required
              />
            </div>
            {passwordError && <span className={styles.fieldError}>{passwordError}</span>}
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            <MdPersonAdd size={20} />
            {loading ? "Creating Account..." : "Create Account"}
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