import React, { useState, useEffect } from 'react'
import styles from "./customizeProfileModal.module.css"
import { FaTimes, FaCamera, FaPalette, FaImage, FaCheck } from "react-icons/fa";
import Axios from "axios"

function CustomizeProfileModal({ isOpen, onClose, currentProfilePic, currentBanner, onProfileUpdated }) {
    const [activeTab, setActiveTab] = useState('profilePicture')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    
    // Profile Picture States
    const [selectedProfilePic, setSelectedProfilePic] = useState(null)
    const [profilePicPreview, setProfilePicPreview] = useState(currentProfilePic || "")
    
    // Banner States
    const [bannerType, setBannerType] = useState('color')
    const [selectedBannerColor, setSelectedBannerColor] = useState("")
    const [selectedBannerImage, setSelectedBannerImage] = useState(null)
    const [bannerImagePreview, setBannerImagePreview] = useState("")
    const [bannerColors, setBannerColors] = useState([])
    const [currentBannerPreview, setCurrentBannerPreview] = useState(currentBanner || "")

    const userId = localStorage.getItem("userId")

    useEffect(() => {
        if (isOpen) {
            fetchBannerColors()
        }
    }, [isOpen])

    const fetchBannerColors = async () => {
        try {
            const response = await Axios.get("http://localhost:1337/api/getBannerColors")
            if (response.data.success) {
                setBannerColors(response.data.colors)
            }
        } catch (error) {
            console.error("Error fetching banner colors:", error)
        }
    }

    const handleProfilePicChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedProfilePic(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setProfilePicPreview(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBannerImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setSelectedBannerImage(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setBannerImagePreview(e.target.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleBannerColorSelect = (color) => {
        setSelectedBannerColor(color.value)
        setCurrentBannerPreview(color.value)
    }

    const uploadProfilePicture = async () => {
        if (!selectedProfilePic || !userId) return

        setLoading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append('profilePicture', selectedProfilePic)
            formData.append('userId', userId)

            const response = await Axios.post("http://localhost:1337/api/uploadProfilePicture", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                setSuccess("Profile picture updated successfully!")
                localStorage.setItem("profilePic", response.data.profilePicUrl)
                if (onProfileUpdated) {
                    onProfileUpdated()
                }
                setTimeout(() => {
                    setSuccess("")
                }, 3000)
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error)
            setError("Failed to upload profile picture. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const updateBanner = async () => {
        if (!userId) return

        setLoading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append('userId', userId)
            formData.append('bannerType', bannerType)

            if (bannerType === 'color') {
                formData.append('bannerColor', selectedBannerColor)
            } else if (bannerType === 'image' && selectedBannerImage) {
                formData.append('bannerImage', selectedBannerImage)
            } else {
                setError("Please select a banner color or upload an image")
                setLoading(false)
                return
            }

            const response = await Axios.post("http://localhost:1337/api/updateBanner", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (response.data.success) {
                setSuccess("Banner updated successfully!")
                if (onProfileUpdated) {
                    onProfileUpdated()
                }
                setTimeout(() => {
                    setSuccess("")
                }, 3000)
            }
        } catch (error) {
            console.error("Error updating banner:", error)
            setError("Failed to update banner. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setError("")
        setSuccess("")
        setSelectedProfilePic(null)
        setProfilePicPreview(currentProfilePic || "")
        setSelectedBannerColor("")
        setSelectedBannerImage(null)
        setBannerImagePreview("")
        setCurrentBannerPreview(currentBanner || "")
        setActiveTab('profilePicture')
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h2>Customize Profile</h2>
                        <p>Personalize your profile appearance</p>
                    </div>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${activeTab === 'profilePicture' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('profilePicture')}
                    >
                        <FaCamera size={16} />
                        Profile Picture
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'banner' ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab('banner')}
                    >
                        <FaPalette size={16} />
                        Banner
                    </button>
                </div>

                <div className={styles.content}>
                    {activeTab === 'profilePicture' && (
                        <div className={styles.profilePictureSection}>
                            <div className={styles.currentProfilePic}>
                                <h3>Current Profile Picture</h3>
                                <div className={styles.profilePicPreview}>
                                    <img 
                                        src={profilePicPreview} 
                                        alt="Profile Preview" 
                                        className={styles.previewImage}
                                    />
                                </div>
                            </div>

                            <div className={styles.uploadSection}>
                                <h3>Upload New Picture</h3>
                                <div className={styles.fileUpload}>
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                        className={styles.fileInput}
                                    />
                                    <label htmlFor="profilePicture" className={styles.fileLabel}>
                                        <FaImage size={20} />
                                        Choose Image
                                    </label>
                                </div>
                                <p className={styles.fileInfo}>
                                    Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
                                </p>
                            </div>

                            <button 
                                className={styles.saveButton}
                                onClick={uploadProfilePicture}
                                disabled={!selectedProfilePic || loading}
                            >
                                {loading ? "Uploading..." : "Update Profile Picture"}
                            </button>
                        </div>
                    )}

                    {activeTab === 'banner' && (
                        <div className={styles.bannerSection}>
                            <div className={styles.bannerPreview}>
                                <h3>Banner Preview</h3>
                                <div 
                                    className={styles.bannerPreviewArea}
                                    style={{ 
                                        background: currentBannerPreview || currentBanner || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    }}
                                >
                                    <div className={styles.bannerOverlay}>
                                        <span>Your Banner</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.bannerOptions}>
                                <div className={styles.bannerTypeSelector}>
                                    <button 
                                        className={`${styles.typeButton} ${bannerType === 'color' ? styles.typeButtonActive : ''}`}
                                        onClick={() => setBannerType('color')}
                                    >
                                        <FaPalette size={16} />
                                        Color
                                    </button>
                                    <button 
                                        className={`${styles.typeButton} ${bannerType === 'image' ? styles.typeButtonActive : ''}`}
                                        onClick={() => setBannerType('image')}
                                    >
                                        <FaImage size={16} />
                                        Image
                                    </button>
                                </div>

                                {bannerType === 'color' && (
                                    <div className={styles.colorSelector}>
                                        <h4>Choose a Color</h4>
                                        <div className={styles.colorGrid}>
                                            {bannerColors.map((color, index) => (
                                                <button
                                                    key={index}
                                                    className={styles.colorOption}
                                                    style={{ background: color.value }}
                                                    onClick={() => handleBannerColorSelect(color)}
                                                    title={color.name}
                                                >
                                                    {selectedBannerColor === color.value && (
                                                        <FaCheck className={styles.colorCheck} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {bannerType === 'image' && (
                                    <div className={styles.imageUpload}>
                                        <h4>Upload Banner Image</h4>
                                        <div className={styles.fileUpload}>
                                            <input
                                                type="file"
                                                id="bannerImage"
                                                accept="image/*"
                                                onChange={handleBannerImageChange}
                                                className={styles.fileInput}
                                            />
                                            <label htmlFor="bannerImage" className={styles.fileLabel}>
                                                <FaImage size={20} />
                                                Choose Image
                                            </label>
                                        </div>
                                        {bannerImagePreview && (
                                            <div className={styles.imagePreview}>
                                                <img src={bannerImagePreview} alt="Banner Preview" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button 
                                className={styles.saveButton}
                                onClick={updateBanner}
                                disabled={loading || (bannerType === 'color' && !selectedBannerColor) || (bannerType === 'image' && !selectedBannerImage)}
                            >
                                {loading ? "Updating..." : "Update Banner"}
                            </button>
                        </div>
                    )}
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className={styles.successMessage}>
                        {success}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CustomizeProfileModal
