import React, { useContext, useEffect } from 'react'
import styles from "./navbar.module.css"
import { CgProfile } from "react-icons/cg";
import UserContext from '../../../contexts/User';
import { useNavigate } from "react-router-dom"
import { GiHamburgerMenu } from "react-icons/gi";

function Navbar() {
  const navigate = useNavigate()
  // const { userId } = useContext(UserContext)
  const userId = localStorage.getItem("userId")
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

  return (
    <div className={styles.container}>
      <div className={styles.left}>
      <GiHamburgerMenu style={{ color: "white" }} className={styles.hamburger} onClick={openMobile}/>
      </div>
      <div className={styles.right}>
        {userId.length > 0 ? (
          <CgProfile style={{ color: "white", height: "26px", width: "26px", cursor: "pointer" }} onClick={routeProfile}/>
          // <p>logged in</p>
        ) : (
          <button onClick={routeLogin}>Login</button>
        )}
      </div>
    </div>
  )
}

export default Navbar