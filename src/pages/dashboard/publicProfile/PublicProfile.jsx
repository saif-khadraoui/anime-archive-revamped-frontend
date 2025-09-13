import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/publicProfile/publicProfile.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import Axios from "axios"
import SyncLoader from "react-spinners/SyncLoader"
import { 
  FaUser, 
  FaCalendarAlt, 
  FaHeart,
  FaBookmark,
  FaStar,
  FaUsers,
  FaChartBar
} from "react-icons/fa"
import { MdFavorite, MdPlaylistPlay, MdRateReview } from "react-icons/md"

function PublicProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [favoriteAnime, setFavoriteAnime] = useState([])

  // Fetch public user data
  useEffect(() => {
    const fetchPublicUserData = async () => {
      if (!username) return
      
      try {
        setLoading(true)
        
        // Fetch user details, statistics, and favorites in parallel
        const [userDetailsResponse, userStatsResponse, favoritesResponse] = await Promise.all([
          Axios.get("https://anime-archive-revamped.onrender.com/api/getPublicUserDetails", {
            params: { username }
          }),
          Axios.get("https://anime-archive-revamped.onrender.com/api/getPublicUserStats", {
            params: { username }
          }),
          Axios.get("https://anime-archive-revamped.onrender.com/api/getPublicFavorites", {
            params: { username }
          })
        ])
        
        setUserDetails(userDetailsResponse.data)
        setUserStats(userStatsResponse.data)
        
        if (favoritesResponse.data.success) {
          setFavoriteAnime(favoritesResponse.data.favorites)
        }
      } catch (error) {
        console.error("Error fetching public user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicUserData()
  }, [username])

  const handleAnimeClick = (animeId, animeType) => {
    if (animeType === "Manga") {
      navigate(`/dashboard/manga/${animeId}`)
    } else {
      navigate(`/dashboard/anime/${animeId}`)
    }
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

  if (!userDetails) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorState}>
          <FaUser size={48} />
          <h2>User Not Found</h2>
          <p>The user you're looking for doesn't exist or their profile is private.</p>
          <button onClick={() => navigate(-1)} className={styles.backButton}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.coverPhoto}>
          <div className={styles.coverOverlay}>
            <div className={styles.coverOverlayContent}>
              <div className={styles.coverUserDetails}>
                <div className={styles.profilePicture}>
                  <img 
                    src={userDetails.profilePic || "https://via.placeholder.com/150/667eea/ffffff?text=User"} 
                    alt="Profile" 
                  />
                </div>
                <div className={styles.coverUserDetailsContent}>
                  <h1 className={styles.username}>{userDetails.username}</h1>
                  <p className={styles.userTitle}>Anime Enthusiast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.profileInfo}>
          <div className={styles.userDetails}>
            <div className={styles.userMeta}>
              <div className={styles.metaItem}>
                <FaCalendarAlt size={14} />
                <span>Joined {userDetails.joinDate ? new Date(userDetails.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                }) : "Recently"}</span>
              </div>
            </div>
            
            <div className={styles.bio}>
              <p>{userDetails.bio || "No bio available"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <h3>Statistics</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MdPlaylistPlay size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.animeInLists || 0}</div>
              <div className={styles.statLabel}>Anime in Lists</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MdPlaylistPlay size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.mangaInLists || 0}</div>
              <div className={styles.statLabel}>Manga in Lists</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MdRateReview size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.reviewsWritten || 0}</div>
              <div className={styles.statLabel}>Reviews Written</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <MdPlaylistPlay size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.listsCreated || 0}</div>
              <div className={styles.statLabel}>Lists Created</div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Anime Section */}
      <div className={styles.favoritesSection}>
        <div className={styles.sectionHeader}>
          <h3>
            <MdFavorite size={24} />
            Favorite Anime
          </h3>
          <span className={styles.animeCount}>{favoriteAnime.length} anime</span>
        </div>
        
        <div className={styles.favoritesGrid}>
          {favoriteAnime.length > 0 ? (
            favoriteAnime.map((anime) => (
              <div 
                key={anime.animeId} 
                className={styles.favoriteCard}
                onClick={() => handleAnimeClick(anime.animeId, anime.type)}
              >
                <div className={styles.animeImage}>
                  <img src={anime.image} alt={anime.title} />
                  <div className={styles.animeOverlay}>
                    <div className={styles.addedDate}>
                      <span>Added {new Date(anime.addedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.animeInfo}>
                  <h4>{anime.title}</h4>
                  <p>{anime.type || "Anime"} • ID: {anime.animeId}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyFavorites}>
              <MdFavorite size={48} />
              <p>No favorite anime yet</p>
              <span>This user hasn't added any anime to their favorites.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicProfile
