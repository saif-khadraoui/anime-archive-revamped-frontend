import React, { useState } from 'react'
import styles from "./addReviewModal.module.css";
import { MdClose } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import Axios from "axios"

function AddReviewModal({ setModal, animeId }) {
    const userId = localStorage.getItem("userId")
    const username = localStorage.getItem("username")
    const userPic = localStorage.getItem("profilePic")
    const [guest, setGuest] = useState(userId ? false : true)
    const [rating, setRating] = useState(0)
    const [content, setContent] = useState("")

    const addReview = async () => {
        setModal(false)
        await Axios.post("https://anime-archive-revamped.onrender.com/api/addReview", {
            guest: guest,
            animeId: animeId,
            userId: userId,
            username: username,
            userPic: userPic,
            rating: rating,
            content: content
        }).then((response) => {
            console.log(response)
            // toast("review added")
            alert("review added")

        })
    }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Add Review</h3>
                <button className={styles.closeButton} onClick={() => setModal(false)}>
                    <MdClose size={20} />
                </button>
            </div>
            <div className={styles.formContent}>
                <div className={styles.anonymous}>
                    <p>Post as Anonymous</p>
                    <div className={styles.checkboxContainer}>
                        {userId ? (
                            <input 
                                type="checkbox" 
                                checked={guest} 
                                onChange={(e) => setGuest(e.target.checked)}
                            />
                        ) : (
                            <input type="checkbox" checked disabled />
                        )}
                    </div>
                </div>
                <div className={styles.rating}>
                    <p>Rating</p>
                    <div className={styles.ratingInput}>
                        <input 
                            type="range" 
                            min={0} 
                            max={10} 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)}
                            className={styles.ratingSlider}
                        />
                        <div className={styles.starRating}>
                            <p>{rating}</p>
                            <FaStar style={{ color: "#ffd700" }} />
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    <p>Your Review</p>
                    <textarea 
                        placeholder='Share your thoughts about this anime...' 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className={styles.button}>
                    <button onClick={addReview}>Submit Review</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddReviewModal