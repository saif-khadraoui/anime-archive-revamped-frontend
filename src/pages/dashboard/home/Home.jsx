import React, { useContext } from 'react'
import styles from "../../../ui/dashboard/home/home.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { FaStar, FaPlay, FaBookmark } from "react-icons/fa6";
import { MdPlayArrow } from "react-icons/md";
import UserConext from '../../../contexts/User';
import TopRated from '../../../ui/dashboard/home/topRated/TopRated';

function Home() {

  const { userId } = useContext(UserConext)

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.heroAnime}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.heroAnimeInfo}>
              <div className={styles.heroAnimeTitle}>
                <h2>Naruto</h2>
              </div>
              <div className={styles.heroAnimeMeta}>
                <span className={styles.episodes}>220 Episodes</span>
                <span className={styles.year}>2002</span>
                <span className={styles.type}>TV Series</span>
              </div>
              <div className={styles.heroAnimeDesc}>
                Follow the journey of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.
              </div>
              <div className={styles.heroActions}>
                <div className={styles.rating}>
                  <FaStar size={16} />
                  <span>9.0</span>
                </div>
                <div className={styles.actionButtons}>
                  <button className={styles.playButton}>
                    <MdPlayArrow size={20} />
                    Watch Now
                  </button>
                  <button className={styles.bookmarkButton}>
                    <FaBookmark size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TopRated />
    </div>
  )
}

export default Home