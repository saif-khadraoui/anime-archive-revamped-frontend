import React, { useState, useEffect } from 'react'
import styles from "./review.module.css"
import { FaStar } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Axios from "axios"

function Review({review}) {
    const navigate = useNavigate()
    const userId = localStorage.getItem("userId")
    const reviewId = review._id
    const [update, setUpdate] = useState(false)

    const [upVotes, setUpVotes] = useState()
    const [downVotes, setDownVotes] = useState()
    const [upVoteIsTrue, setUpVoteIsTrue] = useState(false)
    const [downVoteIsTrue, setDownVoteIsTrue] = useState(false)

    const handleUsernameClick = () => {
        if (!review.Guest && review.Username) {
            navigate(`/dashboard/public-profile/${review.Username}`)
        }
    }

    const attemptVote = async (type) => {
        console.log(type)
        console.log(downVoteIsTrue)


        if(type == "up" && upVoteIsTrue == true || type == "down" && downVoteIsTrue == true){
            console.log("here")
            await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteVote", {
                params: { reviewId, userId }
            }).then((response) => {
                console.log(response)
                setUpdate(!update)
            })
        }

        else if (type == "up" && downVoteIsTrue == true || type == "down" && upVoteIsTrue == true){
            await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteVote", {
                params: { reviewId, userId }
            }).then((response) => {
                console.log(response)
            })
            await Axios.post("https://anime-archive-revamped.onrender.com/api/vote", {
            reviewId: reviewId,
            userId: userId,
            vote: type == "up" ? true : false
        }).then((response) => {
            console.log(response)
            setUpdate(!update)
        })
        } else{
            await Axios.post("https://anime-archive-revamped.onrender.com/api/vote", {
                reviewId: reviewId,
                userId: userId,
                vote: type == "up" ? true : false
            }).then((response) => {
                console.log(response)
                setUpdate(!update)
            })
        }




    }

    useEffect(() => {
        const getVotes = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getVotes" , {
                params: { reviewId }
            }).then((response) => {
                // console.log(response)
                setUpVotes(response.data.upVotes)
                setDownVotes(response.data.downVotes)
            })
        }

        getVotes()

        const checkIfVoted = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/checkIfVoted", {
                params: { reviewId, userId }
            }).then((response) => {
                // console.log(response)
                if(response.data[0]?.Vote == true){
                    setUpVoteIsTrue(true)
                    setDownVoteIsTrue(false)
                } 

                if(response.data[0]?.Vote == false){
                    setDownVoteIsTrue(true)
                    setUpVoteIsTrue(false)
                } 
            })
        }

        checkIfVoted()

    }, [update])


  return (
    <div className={styles.reviewItem}>
        <div className={styles.reviewItemTop}>
            <div className={styles.reviewItemLeft}>
                <CgProfile style={{ width: "30px", height: "30px" }}/>
                <div className={styles.userDetails}>
                    {review.Guest == true ? (
                        <p className={styles.username}>Anonymous</p>
                    ) : (
                        <p 
                            className={`${styles.username} ${styles.clickableUsername}`}
                            onClick={handleUsernameClick}
                            title="View profile"
                        >
                            {review.Username}
                        </p>
                    )}
                    <p className={styles.date}>{review.createdAt?.slice(0,10)}</p>
                </div>
            </div>
            <div className={styles.reviewItemRight}>
                <div className={styles.reviewRating}>
                    <p>{review.Rating}</p>
                    <FaStar style={{ color: "gold" }}/>
                </div>
            </div>
        </div>
            
            <div className={styles.reviewContent}>
                <p>{review.Content}</p>
            </div>
            <div className={styles.reviewVote}>
                <div className={styles.vote}>
                    <p>{upVotes}</p>
                    <FaArrowAltCircleUp style={{ cursor: "pointer", color: upVoteIsTrue ? "red" : "white" }} onClick={(() => attemptVote("up"))}/>
                </div>
                <div className={styles.vote}>
                    <p>{downVotes}</p>
                    <FaArrowAltCircleDown style={{ cursor: "pointer", color: downVoteIsTrue ? "red" : "white" }} onClick={(() => attemptVote("down"))}/>
                </div>
            </div>

    </div>
  )
}

export default Review