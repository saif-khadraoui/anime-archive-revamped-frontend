import React, { useState, useContext, useEffect } from 'react'
import styles from "../../../ui/dashboard/profile/profile.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import UserContext from '../../../contexts/User'
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

function Profile() {
  const { username, email, profilePic } = useContext(UserContext)
  const [isEditing, setIsEditing] = useState(false)
  const [showCustomization, setShowCustomization] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState(null)
  const [userStats, setUserStats] = useState(null)
  
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

  // Mock favorite anime data
  const favoriteAnime = [
    {
      id: 1,
      title: "Attack on Titan",
      image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
      rating: 9.5,
      episodes: 75,
      status: "Completed"
    },
    {
      id: 2,
      title: "Demon Slayer",
      image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
      rating: 9.2,
      episodes: 44,
      status: "Watching"
    },
    {
      id: 3,
      title: "Your Name",
      image: "https://cdn.myanimelist.net/images/anime/1122/96435.jpg",
      rating: 9.0,
      episodes: 1,
      status: "Completed"
    },
    {
      id: 4,
      title: "One Piece",
      image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      rating: 8.8,
      episodes: 1000,
      status: "Watching"
    }
  ]

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

  const handleCustomization = () => {
    setShowCustomization(!showCustomization)
  }

  // Fetch user details and statistics from API
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId")
      if (userId) {
        try {
          setLoading(true)
          
          // Fetch user details and statistics in parallel
          const [userDetailsResponse, userStatsResponse] = await Promise.all([
            Axios.get("https://anime-archive-revamped.onrender.com/api/getUserDetails", {
              params: { userId }
            }),
            Axios.get("https://anime-archive-revamped.onrender.com/api/getUserStats", {
              params: { userId }
            })
          ])
          
        setUserDetails(userDetailsResponse.data)
        setUserStats(userStatsResponse.data)
        console.log("user profile fetched:", userDetailsResponse.data)
        
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
        <div className={styles.coverPhoto}>
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
              <button className={styles.customizeButton} onClick={handleCustomization}>
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
          {favoriteAnime.map((anime) => (
            <div key={anime.id} className={styles.favoriteCard}>
              <div className={styles.animeImage}>
                <img src={anime.image} alt={anime.title} />
                <div className={styles.animeOverlay}>
                  <div className={styles.rating}>
                    <FaStar size={14} />
                    <span>{anime.rating}</span>
                  </div>
                  <div className={styles.status}>
                    {anime.status}
                  </div>
                </div>
              </div>
              <div className={styles.animeInfo}>
                <h4>{anime.title}</h4>
                <p>{anime.episodes} episodes</p>
              </div>
            </div>
          ))}
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
    </div>
  )
}

export default Profile