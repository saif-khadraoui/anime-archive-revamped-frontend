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
    <div className={styles.container}>
        <div className={styles.header}>
            <h3>Add review</h3>
            <MdClose onClick={() => setModal(false)} style={{ color: "white", cursor: "pointer" }}/>
        </div>
        <div className={styles.anonymous}>
            <p>Anonymous</p>
            {userId ? (
                <input type="checkbox" defaultChecked={guest} onChange={((e) => setGuest(e.target.checked))}/>
            ) : (
                <input type="checkbox" checked disabled/>
            )}
        </div>
        <div className={styles.rating}>
            <p>Rating</p>
            <input type="range" min={0} max={10} value={rating} onChange={((e) => setRating(e.target.value))}/>
            <div className={styles.starRating}>
                <p>{rating}</p>
                <FaStar style={{ color: "gold" }}/>
            </div>
        </div>
        <div className={styles.content}>
            <p>Review</p>
            <textarea placeholder='What do you think about this anime?' rows={10} value={content} onChange={((e) => setContent(e.target.value))}/>
        </div>
        <div className={styles.button}>
            <button onClick={addReview}>Add review</button>
        </div>
    </div>
  )
}

export default AddReviewModal