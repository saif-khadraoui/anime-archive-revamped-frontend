import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/song/song.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import ReactPlayer from 'react-player'
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { MdArrowBack, MdMusicNote, MdThumbUp, MdThumbDown } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";

function Song() {
    const {id, basename} = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [link, setLink] = useState()
    const [loading, setLoading] = useState(true)
    const userId = localStorage.getItem("userId")

    const [update, setUpdate] = useState(false)

    const [upVotes, setUpVotes] = useState()
    const [downVotes, setDownVotes] = useState()
    const [upVoteIsTrue, setUpVoteIsTrue] = useState(false)
    const [downVoteIsTrue, setDownVoteIsTrue] = useState(false)

    const handleBackNavigation = () => {
        const fromPage = location.state?.fromPage
        if (fromPage === 'topSongs') {
            navigate('/dashboard/topSongs')
        } else if (fromPage === 'songs') {
            // Go back to songs page
            navigate(`/dashboard/${id}/songs`)
        } else {
            // Default behavior: go back to songs page
            navigate(`/dashboard/${id}/songs`)
        }
    }

    const attemptVote = async (type) => {
        console.log(type)
        console.log(downVoteIsTrue)


        if(type == "up" && upVoteIsTrue == true || type == "down" && downVoteIsTrue == true){
            console.log("here")
            await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteSongVote", {
                params: { basename, userId }
            }).then((response) => {
                console.log(response)
                setUpdate(!update)
            })
        }

        else if (type == "up" && downVoteIsTrue == true || type == "down" && upVoteIsTrue == true){
            await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteSongVote", {
                params: { basename, userId }
            }).then((response) => {
                console.log(response)
            })
            await Axios.post("https://anime-archive-revamped.onrender.com/api/addSongVote", {
                animeId: id,
                basename: basename,
                userId: userId,
                vote: type == "up" ? true : false
        }).then((response) => {
            console.log(response)
            setUpdate(!update)
        })
        } else{
            await Axios.post("https://anime-archive-revamped.onrender.com/api/addSongVote", {
                animeId: id,
                basename: basename,
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
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getSongVotes" , {
                params: { basename }
            }).then((response) => {
                // console.log(response)
                setUpVotes(response.data.upVotes)
                setDownVotes(response.data.downVotes)
            })
        }

        getVotes()

        const checkIfVoted = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/checkIfSongVoted", {
                params: { basename, userId }
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


    useEffect(() => {
        const fetchSong = async () => {
            try {
                setLoading(true)
                await Axios.get(`https://api.animethemes.moe/video/${basename}`).then((response) => {
                    console.log(response)
                    setLink(response.data.video.link)
                })
            } catch (error) {
                console.error("Error fetching song:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSong()
    }, [basename])

    // const addVote = async (type) => {
    //     await Axios.post("https://anime-archive-revamped.onrender.com/api/addSongVote", {
    //         userId: userId,
    //         basename: basename,
    //         vote: type == "up" ? true : false
    //     }).then((response) => {
    //         console.log(response)
    //     })
    // }

  return (
    <div className={styles.container}>
        <Navbar />
        
        {/* Header Section */}
        <div className={styles.header}>
            <button className={styles.backButton} onClick={handleBackNavigation}>
                <MdArrowBack size={20} />
                {location.state?.fromPage === 'topSongs' ? 'Back to Top Songs' : 'Back to Songs'}
            </button>
            <div className={styles.headerContent}>
                <div className={styles.songIcon}>
                    <MdMusicNote size={32} />
                </div>
                <div className={styles.songInfo}>
                    <h1>Anime Song</h1>
                    <p>Opening / Ending Theme</p>
                </div>
            </div>
        </div>

        {/* Video Section */}
        <div className={styles.videoSection}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <SyncLoader color="#667eea" />
                    <p>Loading video...</p>
                </div>
            ) : link ? (
                <div className={styles.videoContainer}>
                    <ReactPlayer 
                        url={link} 
                        playing={false} 
                        controls={true} 
                        width="100%" 
                        height="10%"
                        config={{
                            file: {
                                attributes: {
                                    style: { borderRadius: '12px' }
                                }
                            }
                        }}
                    />
                </div>
            ) : (
                <div className={styles.errorState}>
                    <div className={styles.errorIcon}>
                        <MdMusicNote size={64} />
                    </div>
                    <h3>Video Not Available</h3>
                    <p>This song video could not be loaded</p>
                </div>
            )}
        </div>

        {/* Voting Section */}
        {userId && (
            <div className={styles.votingSection}>
                <div className={styles.votingHeader}>
                    <h3>Rate this song</h3>
                    <p>Help others discover great music</p>
                </div>
                <div className={styles.votingButtons}>
                    <button 
                        className={`${styles.voteButton} ${upVoteIsTrue ? styles.voteButtonActive : ''}`}
                        onClick={() => attemptVote("up")}
                    >
                        <MdThumbUp size={20} />
                        <span>{upVotes || 0}</span>
                    </button>
                    <button 
                        className={`${styles.voteButton} ${downVoteIsTrue ? styles.voteButtonActive : ''}`}
                        onClick={() => attemptVote("down")}
                    >
                        <MdThumbDown size={20} />
                        <span>{downVotes || 0}</span>
                    </button>
                </div>
            </div>
        )}

        {/* Comments Section */}
        <div className={styles.commentsSection}>
            <div className={styles.commentsHeader}>
                <h3>Comments</h3>
                <p>Share your thoughts about this song</p>
            </div>
            <div className={styles.commentsPlaceholder}>
                <div className={styles.commentsIcon}>
                    <MdMusicNote size={48} />
                </div>
                <p>Comments feature coming soon</p>
            </div>
        </div>
    </div>
  )
}

export default Song