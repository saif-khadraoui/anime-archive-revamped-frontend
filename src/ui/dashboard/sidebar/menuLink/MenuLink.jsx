import React, { useContext } from 'react'
import styles from "./menuLink.module.css"
import { Link, useLocation } from 'react-router-dom'
import UserConext from '../../../../contexts/User'

function MenuLink({ item }) {
    const pathname = useLocation()
    const { setUserId, setUsername, setEmail, setProfilePic } = useContext(UserConext)
    console.log(pathname.pathname)
  

    // if(item.title == "Logout"){
      // setUserId("")
      // setUsername("")
      // setEmail("")
      // setProfilePic("")
    // }

    const closeMobile = () => {
      document.getElementById("mobileContainer").style.display = "none"
    }
  return (
    <Link to={item.path} className={`${styles.container} ${pathname.pathname === item.path && styles.active}`} onClick={closeMobile}>
        {item.icon}
        {item.title}
    </Link>
  )
}

export default MenuLink