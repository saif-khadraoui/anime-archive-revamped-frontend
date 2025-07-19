import React from 'react'
import styles from "../../ui/dashboard/dashboard.module.css"
import Sidebar from '../../ui/dashboard/sidebar/Sidebar'
import Rightbar from '../../ui/dashboard/rightbar/Rightbar'
import { Outlet } from "react-router-dom"

function Dashboard() {
  return (
    <div className={styles.container}>
        <Sidebar />
        <Outlet />
        <Rightbar />
    </div>
  )
}

export default Dashboard