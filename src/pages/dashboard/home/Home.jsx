import React, { useContext } from 'react'
import styles from "../../../ui/dashboard/home/home.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { FaStar } from "react-icons/fa6";
import UserConext from '../../../contexts/User';
import TopRated from '../../../ui/dashboard/home/topRated/TopRated';

function Home() {

  const { userId } = useContext(UserConext)

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.heroAnime}>
          {/* <div className={styles.heroAnimeHeader}>
            <div className={styles.rating}>
              <p>9.0</p>
            </div>
          </div> */}
          <div className={styles.heroAnimeInfo}>
            <div className={styles.heroAnimeTitle}>
              <h2>Naruto</h2>
            </div>
            <div className={styles.heroAnimeLength}>
              220 Episodes
            </div>
            <div className={styles.heroAnimeDesc}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo iusto quas quidem tempore laboriosam, corporis quia non ut. Commodi aut praesentium harum voluptate ipsum magnam itaque rerum minima at fugiat!
            </div>
            <div className={styles.rating}>
              <p>9.0</p><FaStar style={{ color: "white", width: "12px", height: "12px" }}/>
            </div>
          </div>
        </div>
        {/* <div className={styles.topRated}>
          <div className={styles.topRatedHeader}>
            <h3>Top Rated Animes</h3>
          </div>
        </div> */}
        <TopRated />
    </div>
  )
}

export default Home