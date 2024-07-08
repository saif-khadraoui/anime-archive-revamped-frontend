import React, { useEffect, useState } from 'react'
import styles from "../../../ui/dashboard/topSongs/topSongs.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"

function TopSongs() {

  useEffect(() => {
    const fetchTopSongs = async () => {
      await Axios.get("https://anime-archive-revamped.onrender.com/api/getTopSongs").then((response) => {
        console.log(response)
      })
    }

    fetchTopSongs()
  }, [])

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.content}>
            <h4>Popular openings/endings this week</h4>
        </div>
    </div>
  )
}

export default TopSongs