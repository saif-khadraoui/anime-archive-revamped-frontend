import React, { useState, useContext, useEffect } from 'react'
import styles from "../../../ui/dashboard/profile/profile.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import UserContext from '../../../contexts/User'
import { useNavigate } from 'react-router-dom'
import Axios from "axios"
import { 
  FaEdit, 
  FaHeart, 
  FaBookmark, 
  FaStar, 
  FaUser, 
  FaCalendarAlt, 
  FaEnvelope,
  FaCog,
  FaPalette,
  FaSave,
  FaTimes,
  FaPlay,
  FaEye
} from "react-icons/fa"
import { MdFavorite, MdFavoriteBorder } from "react-icons/md"
import SyncLoader from "react-spinners/SyncLoader"
import CustomizeProfileModal from '../../../ui/dashboard/profile/customizeProfileModal/CustomizeProfileModal'

function Profile() {
  const { username, email, profilePic } = useContext(UserContext)
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [favoriteAnime, setFavoriteAnime] = useState([])
  
  // User profile data - will be populated from API
  const [userProfile, setUserProfile] = useState({
    bio: "",
    joinDate: "",
    location: "",
    favoriteGenres: ["Action", "Romance", "Fantasy"],
    stats: {
      animeWatched: 156,
      mangaRead: 89,
      reviewsWritten: 23,
      listsCreated: 8
    }
  })


  const [customization, setCustomization] = useState({
    theme: "dark",
    accentColor: "#667eea",
    backgroundPattern: "gradient",
    showStats: true,
    showFavorites: true
  })

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error("No user ID found");
        return;
      }

      const response = await Axios.put("https://anime-archive-revamped.onrender.com/api/editProfile", {
        userId: userId,
        bio: userProfile.bio,
        location: userProfile.location
      });

      if (response.data.success) {
        // Update userDetails with the new data
        setUserDetails(prev => ({
          ...prev,
          bio: response.data.user.bio,
          location: response.data.user.location
        }));
        
        setIsEditing(false);
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  const handleAnimeClick = (animeId, animeType) => {
    if (animeType === "Manga") {
      navigate(`/dashboard/manga/${animeId}`)
    } else {
      navigate(`/dashboard/anime/${animeId}`)
    }
  }

  const handleCustomization = () => {
    setShowCustomization(!showCustomization)
  }


  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      try {
        setLoading(true)
        
      // Fetch user details, statistics, and favorites in parallel
      const [userDetailsResponse, userStatsResponse, favoritesResponse] = await Promise.all([
        Axios.get("https://anime-archive-revamped.onrender.com/api/getUserDetails", {
          params: { userId }
        }),
        Axios.get("https://anime-archive-revamped.onrender.com/api/getUserStats", {
          params: { userId }
        }),
        Axios.get("https://anime-archive-revamped.onrender.com/api/getFavorites", {
          params: { userId }
        })
      ])
      
      setUserDetails(userDetailsResponse.data)
      setUserStats(userStatsResponse.data)
      console.log("user profile fetched:", userDetailsResponse.data)
      
      if (favoritesResponse.data.success) {
        setFavoriteAnime(favoritesResponse.data.favorites)
      }
      
      // Update userProfile with real data from API
      setUserProfile(prev => ({
        ...prev,
        bio: userDetailsResponse.data.bio || "",
        location: userDetailsResponse.data.location || "",
        joinDate: userDetailsResponse.data.joinDate ? 
          new Date(userDetailsResponse.data.joinDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          }) : "Recently"
      }))
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const handleProfileUpdated = () => {
    // Refresh user details to get updated profile picture and banner
    fetchUserData()
  }

  // Fetch user details and statistics from API
  useEffect(() => {


    fetchUserData()
  }, [])

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

  return (
    <div className={styles.container}>
      <Navbar />
      
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div 
          className={styles.coverPhoto}
          style={{ 
            background: userDetails?.banner || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <div className={styles.coverOverlay}>
            <div className={styles.coverOverlayContent}>
              <div className={styles.coverUserDetails}>
                <div className={styles.profilePicture}>
                  <img 
                    src={userDetails?.profilePic || profilePic || "https://via.placeholder.com/150/667eea/ffffff?text=User"} 
                    alt="Profile" 
                  />
                </div>
                <div className={styles.coverUserDetailsContent}>
                  <h1 className={styles.username}>{userDetails?.username || username || "AnimeFan"}</h1>
                  <p className={styles.userTitle}>Anime Enthusiast</p>
                </div>
             
              </div>
          
          
            <div className={styles.profileActions}>
              <button className={styles.editButton} onClick={handleEditProfile}>
                <FaEdit size={16} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button className={styles.customizeButton} onClick={() => setShowCustomizeModal(true)}>
                <FaPalette size={16} />
                Customize
              </button>
            </div>
            </div>
          </div>
        </div>
        
        <div className={styles.profileInfo}>
        
          
          <div className={styles.userDetails}>
            
            <div className={styles.userMeta}>
              <div className={styles.metaItem}>
                <FaCalendarAlt size={14} />
                <span>Joined {userProfile.joinDate}</span>
              </div>
              <div className={styles.metaItem}>
                <FaUser size={14} />
                <span>{userProfile.location}</span>
              </div>
              <div className={styles.metaItem}>
                <FaEnvelope size={14} />
                <span>{userDetails?.email || email || "user@example.com"}</span>
              </div>
            </div>
            
            <div className={styles.bio}>
              {isEditing ? (
                <textarea 
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                  className={styles.bioInput}
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p>{userProfile.bio || "No bio available"}</p>
              )}
            </div>
            
            {isEditing && (
              <div className={styles.locationInput}>
                <label htmlFor="location">Location:</label>
                <input
                  id="location"
                  type="text"
                  value={userProfile.location}
                  onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                  className={styles.locationField}
                  placeholder="Enter your location..."
                />
              </div>
            )}
            
            {isEditing && (
              <div className={styles.editActions}>
                <button className={styles.saveButton} onClick={handleSaveProfile}>
                  <FaSave size={14} />
                  Save Changes
                </button>
                <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                  <FaTimes size={14} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaPlay size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.animeInLists || 0}</div>
              <div className={styles.statLabel}>Anime in Lists</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaBookmark size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.mangaInLists || 0}</div>
              <div className={styles.statLabel}>Manga in Lists</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaStar size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.reviewsWritten || 0}</div>
              <div className={styles.statLabel}>Reviews Written</div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaEye size={24} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statNumber}>{userStats?.listsCreated || 0}</div>
              <div className={styles.statLabel}>Lists Created</div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Genres */}
      <div className={styles.genresSection}>
        <h3>Favorite Genres</h3>
        <div className={styles.genresList}>
          {userProfile.favoriteGenres.map((genre, index) => (
            <span key={index} className={styles.genreTag}>
              {genre}
            </span>
          ))}
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
              <span>Start exploring and add anime to your favorites!</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className={styles.customizationModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Customize Profile</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCustomization(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className={styles.customizationOptions}>
              <div className={styles.optionGroup}>
                <label>Accent Color</label>
                <div className={styles.colorOptions}>
                  {['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'].map(color => (
                    <button
                      key={color}
                      className={`${styles.colorOption} ${customization.accentColor === color ? styles.active : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCustomization({...customization, accentColor: color})}
                    />
                  ))}
                </div>
              </div>
              
              <div className={styles.optionGroup}>
                <label>Background Pattern</label>
                <select 
                  value={customization.backgroundPattern}
                  onChange={(e) => setCustomization({...customization, backgroundPattern: e.target.value})}
                >
                  <option value="gradient">Gradient</option>
                  <option value="solid">Solid</option>
                  <option value="pattern">Pattern</option>
                </select>
              </div>
              
              <div className={styles.optionGroup}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={customization.showStats}
                    onChange={(e) => setCustomization({...customization, showStats: e.target.checked})}
                  />
                  Show Statistics
                </label>
              </div>
              
              <div className={styles.optionGroup}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={customization.showFavorites}
                    onChange={(e) => setCustomization({...customization, showFavorites: e.target.checked})}
                  />
                  Show Favorite Anime
                </label>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button className={styles.saveButton}>
                <FaSave size={16} />
                Save Customization
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Customize Profile Modal */}
      {showCustomizeModal && (
        <CustomizeProfileModal
          isOpen={showCustomizeModal}
          onClose={() => setShowCustomizeModal(false)}
          currentProfilePic={userDetails?.profilePic || profilePic}
          currentBanner={userDetails?.banner}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  )
}

export default Profile