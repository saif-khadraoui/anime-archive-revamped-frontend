import React, { useEffect, useState } from 'react'
import styles from "../../../ui/dashboard/topSongs/topSongs.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { useNavigate } from 'react-router-dom'
import Axios from "axios"
import { MdMusicNote, MdPlayArrow, MdThumbUp, MdTrendingUp } from "react-icons/md"
import SyncLoader from "react-spinners/SyncLoader"

function TopSongs() {
  const navigate = useNavigate()
  const [topSongs, setTopSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        setLoading(true)
        const response = await Axios.get("https://anime-archive-revamped.onrender.com/api/getTopSongs")
        console.log(response)
        
        if (response.data.success) {
          setTopSongs(response.data.topSongs)
        } else {
          setError("Failed to fetch top songs")
        }
      } catch (error) {
        console.error("Error fetching top songs:", error)
        setError("Error loading top songs")
      } finally {
        setLoading(false)
      }
    }

    fetchTopSongs()
  }, [])

    const handleSongClick = (animeId, basename) => {
        navigate(`/dashboard/${animeId}/${basename}`, { 
            state: { fromPage: 'topSongs' } 
        })
    }

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loader}>
          <SyncLoader color="#667eea" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorState}>
          <MdMusicNote size={48} />
          <h2>Error Loading Songs</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
        <Navbar />
        
        {/* Header Section */}
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerIcon}>
                    <MdTrendingUp size={32} />
                </div>
                <div className={styles.headerText}>
                    <h1>Top Songs</h1>
                    <p>Most liked anime openings and endings</p>
                </div>
            </div>
        </div>

        {/* Top Songs List */}
        <div className={styles.songsSection}>
            {topSongs.length > 0 ? (
                <div className={styles.songsList}>
                    {topSongs.map((song, index) => (
                        <div 
                            key={song._id} 
                            className={styles.songCard}
                            onClick={() => handleSongClick(song.animeId, song._id)}
                        >
                            <div className={styles.rank}>
                                <span className={styles.rankNumber}>
                                    {getRankIcon(index + 1)}
                                </span>
                            </div>
                            
                            <div className={styles.songInfo}>
                                <div className={styles.songIcon}>
                                    <MdMusicNote size={24} />
                                </div>
                                <div className={styles.songDetails}>
                                    <h3 className={styles.songTitle}>
                                        {song.cleanSongName || song._id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </h3>
                                    <p className={styles.animeName}>{song.animeName || `Anime ID: ${song.animeId}`}</p>
                                </div>
                            </div>
                            
                            <div className={styles.songStats}>
                                <div className={styles.likesContainer}>
                                    <MdThumbUp size={20} />
                                    <span className={styles.likesCount}>{song.likes}</span>
                                </div>
                                <div className={styles.playButton}>
                                    <MdPlayArrow size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <MdMusicNote size={64} />
                    <h2>No Songs Yet</h2>
                    <p>No songs have been voted on yet. Be the first to like some anime songs!</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default TopSongs