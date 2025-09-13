import React, { useContext, useEffect } from 'react'
import styles from "./navbar.module.css"
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import UserContext from '../../../contexts/User';
import { useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  const navigate = useNavigate()
  // const { userId } = useContext(UserContext)
  const userId = localStorage.getItem("userId") || null
  localStorage.setItem("mobile", "false")

  // useEffect(() => {

  // }, [userId])

  const routeLogin = () => {
    navigate("/login")
  }

  const openMobile = () => {
    localStorage.setItem("mobile", "true")
    document.getElementById("mobileContainer").style.display = "block"
  }

  const routeProfile = () => {
    navigate(`/dashboard/profile/${userId}`)
  }

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("userId")
    localStorage.removeItem("username")
    localStorage.removeItem("email")
    localStorage.removeItem("profilePic")
    
    // Navigate to login page
    navigate("/")
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
      <GiHamburgerMenu style={{ color: "white" }} className={styles.hamburger} onClick={openMobile}/>
      </div>
      <div className={styles.right}>
        {userId?.length > 0 ? (
          <div className={styles.userActions}>
            <CgProfile 
              style={{ color: "white", height: "26px", width: "26px", cursor: "pointer" }} 
              onClick={routeProfile}
              className={styles.profileIcon}
            />
            <MdLogout 
              style={{ color: "white", height: "24px", width: "24px", cursor: "pointer" }} 
              onClick={handleLogout}
              className={styles.logoutIcon}
            />
          </div>
        ) : (
          <button onClick={routeLogin}>Login</button>
        )}
      </div>
    </div>
  )
}

export default Navbar
