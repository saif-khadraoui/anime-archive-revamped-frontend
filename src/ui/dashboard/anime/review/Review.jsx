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
    const [votingLoading, setVotingLoading] = useState(false)

    const handleUsernameClick = () => {
        if (!review.Guest && review.Username) {
            navigate(`/dashboard/public-profile/${review.Username}`)
        }
    }

    const attemptVote = async (type) => {
        if (votingLoading) return // Prevent multiple clicks
        console.log(upVoteIsTrue, downVoteIsTrue)
        
        try {
            setVotingLoading(true)
            console.log("Voting on review:", type, "Current upVote:", upVoteIsTrue, "Current downVote:", downVoteIsTrue)

            // Case 1: User clicks the same button they already voted for (remove vote)
            if((type === "up" && upVoteIsTrue) || (type === "down" && downVoteIsTrue)){
                console.log("Removing existing vote")
                await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteVote", {
                    params: { reviewId, userId }
                })
                // Reset vote states immediately
                setUpVoteIsTrue(false)
                setDownVoteIsTrue(false)
                setUpdate(!update)
            }
            // Case 2: User changes their vote (down to up, or up to down)
            else if((type === "up" && downVoteIsTrue) || (type === "down" && upVoteIsTrue)){
                console.log("Changing vote from", downVoteIsTrue ? "down" : "up", "to", type)
                // First delete the existing vote
                await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteVote", {
                    params: { reviewId, userId }
                })
                // Then add the new vote
                await Axios.post("https://anime-archive-revamped.onrender.com/api/vote", {
                    reviewId: reviewId,
                    userId: userId,
                    vote: type === "up"
                })
                setUpdate(!update)
            }
            // Case 3: User votes for the first time OR re-votes after removal
            else if((type === "up" && !upVoteIsTrue && !downVoteIsTrue) || (type === "down" && !upVoteIsTrue && !downVoteIsTrue)){
                console.log("Adding new vote:", type)
                await Axios.post("https://anime-archive-revamped.onrender.com/api/vote", {
                    reviewId: reviewId,
                    userId: userId,
                    vote: type === "up"
                })
                setUpdate(!update)
            }
        } catch (error) {
            console.error("Error voting on review:", error)
            // You could add a toast notification here to show the error to the user
        } finally {
            setVotingLoading(false)
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
                console.log("checking if voted", response)
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
                    <FaArrowAltCircleUp 
                        style={{ 
                            cursor: votingLoading ? "not-allowed" : "pointer", 
                            color: upVoteIsTrue ? "red" : "white",
                            opacity: votingLoading ? 0.5 : 1
                        }} 
                        onClick={() => !votingLoading && attemptVote("up")}
                    />
                </div>
                <div className={styles.vote}>
                    <p>{downVotes}</p>
                    <FaArrowAltCircleDown 
                        style={{ 
                            cursor: votingLoading ? "not-allowed" : "pointer", 
                            color: downVoteIsTrue ? "red" : "white",
                            opacity: votingLoading ? 0.5 : 1
                        }} 
                        onClick={() => !votingLoading && attemptVote("down")}
                    />
                </div>
            </div>

    </div>
  )
}

export default Review