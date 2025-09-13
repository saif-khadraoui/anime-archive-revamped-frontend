import React, { useState } from 'react'
import styles from "./createThreadModal.module.css"
import { FaTimes, FaComment } from "react-icons/fa";
import Axios from "axios"

function CreateThreadModal({ isOpen, onClose, animeId, onThreadCreated }) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const userId = localStorage.getItem("userId")
    const username = localStorage.getItem("username")
    const profilePic = localStorage.getItem("profilePic")

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!title.trim() || !content.trim()) {
            setError("Please fill in all fields")
            return
        }

        if (!userId) {
            setError("You must be logged in to create a thread")
            return
        }

        setLoading(true)
        setError("")

        try {
            const response = await Axios.post("https://anime-archive-revamped.onrender.com/api/createThread", {
                animeId: animeId,
                title: title.trim(),
                content: content.trim(),
                authorId: userId,
                authorUsername: username,
                authorProfilePic: profilePic || ""
            })

            if (response.data.success) {
                setTitle("")
                setContent("")
                onClose()
                if (onThreadCreated) {
                    onThreadCreated()
                }
            }
        } catch (error) {
            console.error("Error creating thread:", error)
            setError("Failed to create thread. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setTitle("")
        setContent("")
        setError("")
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <FaComment className={styles.headerIcon} />
                        <h2>Create New Thread</h2>
                    </div>
                    <button className={styles.closeButton} onClick={handleClose}>
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="title">Thread Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a descriptive title for your thread..."
                            className={styles.titleInput}
                            maxLength={100}
                        />
                        <span className={styles.charCount}>{title.length}/100</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="content">Thread Content</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your thoughts, ask questions, or start a discussion..."
                            className={styles.contentTextarea}
                            rows={6}
                            maxLength={1000}
                        />
                        <span className={styles.charCount}>{content.length}/1000</span>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button 
                            type="button" 
                            className={styles.cancelButton}
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.submitButton}
                            disabled={loading || !title.trim() || !content.trim()}
                        >
                            {loading ? "Creating..." : "Create Thread"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateThreadModal
