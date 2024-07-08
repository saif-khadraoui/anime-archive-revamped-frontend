import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/anime/anime.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Axios from "axios"
import YouTube, { YouTubeProps } from 'react-youtube';
import { CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { FaStar } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import AddReviewModal from '../../../ui/dashboard/anime/addReviewModal/AddReviewModal'
import Review from '../../../ui/dashboard/anime/review/Review'

function Anime() {
    const opts = {
        height: '100',
        width: '200',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 0,
        },
      };


    const {id} = useParams()
    const pathname = useLocation().pathname
    const animePath = `/dashboard/anime/${id}`
    const mangaPath = `/dashboard/manga/${id}`
    const type = pathname == animePath ? "anime" : "manga"
    const navigate = useNavigate()

    const [animeData, setAnimeData] = useState()
    const [animeRecommendation, setAnimeRecommendation] = useState("")
    const [animeAdded, setAnimeAdded] = useState(false)
    const userId = localStorage.getItem("userId")
    const [modal, setModal] = useState(false)
    const [reviews, setReviews] = useState([])
    const [amount, setAmount] = useState()
    const [recommendations, setRecommendations] = useState()
    const [lists, setLists] = useState([])
    const [selectedList, setSelectedList] = useState("")
    const [showButton, setShowButton] = useState(false)

    const [averageStars, setAverageStars] = useState(0)
    const addToList = async() => {
        setAnimeAdded(true)
        // console.log(selectedList)
        await Axios.post("https://anime-archive-revamped.onrender.com/api/addToList", {
            selectedList: selectedList,
            userId: userId,
            type: animeData?.type == "Manga" ? "Manga" : "Anime",
            animeId: id,
            img: animeData.images?.jpg?.image_url,
            title: animeData.title
        }).then((response) => {
            // console.log(response)
        })
    }

    useEffect(() => {
        // setAnimeAdded(false)
        const fetchLists = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getLists", {
                params: { userId }
              }).then((response) => {
                console.log(response)
                setLists(response.data)
                // setSelectedList(response.data[0]._id)
              })
        }

        fetchLists()
        
        const fetchAnime = async () => {
            await Axios.get(`https://api.jikan.moe/v4/${type}/${id}/full`).then((response) => {
                console.log(response)
                setAnimeData(response.data.data)
                // fetchAnimeRecommendation(response.data.data.title, response.data.data.genres)
            })
        }

        fetchAnime()

        const fetchListAmount = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getAmountAdded", {
                params: { id }
            }).then((response) => {
                // console.log(response)
                setAmount(response.data.amount)
            })
        }

        fetchListAmount()

        const fetchRecommendations = async () => {
            await Axios.get(`https://api.jikan.moe/v4/${type}/${id}/recommendations`).then((response) => {
                // console.log(response.data.data.slice(0,5))
                setRecommendations(response.data.data.slice(0,5))
            })
        }

        fetchRecommendations()

        // const fetchAnimeRecommendation = async (anime, genres) => {
        //     await Axios.post("https://anime-archive-revamped.onrender.com/chat", {
        //         anime: anime,
        //         genres: genres[0].name
        //     }).then((response) => {
        //         console.log(response)
        //         setAnimeRecommendation(response.data)
        //     })
        // }


        const fetchReviews = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getReviews", {
                params: { id }
            }).then((response) => {
                // console.log(response)
                setReviews(response.data)
                // calculateAverageStars()
            })
        }



        fetchReviews()
        
    }, [modal, id, animeAdded])

    useEffect(() => {
        const checkAdded = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/checkAdded", {
                params: { userId, id, selectedList }
            }).then((response) => {
                console.log(response)
                if(response.data.length > 0){
                    setAnimeAdded(true)
                } else{
                    setAnimeAdded(false)
                }
                console.log(animeAdded)
            })
        }

        checkAdded()
    }, [selectedList, animeAdded])

  

    useEffect(() => {
        const calculateAverageStars = () => {
            var totalStars = 0
            // console.log(reviews)
            for(let i=0; i<=reviews.length-1; i++){
                // console.log(reviews[i]?.Rating)
                totalStars += reviews[i].Rating
            }

            // console.log(totalStars)
            // console.log(reviews.length)
            // console.log(totalStars / reviews.length)

            setAverageStars(totalStars / reviews.length)
        }


        calculateAverageStars()
    }, [reviews])

    const updateSelectedList = (e) => {
        if(e.target.value == "Select a list"){
            setShowButton(false)
        } else{
            setShowButton(true)
            setSelectedList(e.target.value)
        }

        // console.log(selectedList)
    }

    

  return (
    <div className={styles.container}>
        <Navbar />
        {animeData ? (
            <div className={styles.anime}>
              <div className={styles.header}>
                  <h3>{animeData.title}</h3>
                  {/* <div className={styles.recommendation}>
                    <p>Anime archive AI thinks you'd like</p>
                    {animeRecommendation ? (
                        <p>{animeRecommendation}</p>
                    ) : <SyncLoader color="red" />}
                  </div> */}
                  
              </div>
              <div className={styles.animeInformation}>
                  <img src={animeData.images?.jpg?.image_url} alt="" />
                  <div className={styles.animeInformationRight}>
                      <div className={styles.animeInformationRightWrapper}>
                          <div className={styles.left}>
                              <div className={styles.stats}>
                                  <div className={styles.score}>
                                      <span>Score</span>
                                      <h4>9.23</h4>
                                  </div>
                                  <div className={styles.listAmount}>
                                      <h3>Added to list</h3>
                                      <p>{amount}</p>
                                  </div>
                              </div>
                              {userId && (
                                <>
                                    {/* {animeAdded ? (
                                        <button>Added</button>
                                    ) : (
                                        <div className={styles.addAnime}>
                                            <select>
                                                {lists.map((list, idx) => {
                                                    return (
                                                        <option>{list.ListName}</option>
                                                    )
                                                })}
                                            </select>
                                            <button type="button" onClick={addToList}>Add to list</button>
                                        </div>
                                    )} */}
                                    {lists.length > 0 ? (
                                        <div className={styles.addAnime}>
                                            <select onChange={updateSelectedList}>
                                                <option value={undefined}>Select a list</option>
                                                {lists.map((list, idx) => {
                                                    return(
                                                        <option value={list._id}>{list.ListName}</option>
                                                    )
                                                })}
                                            </select>
                                            {showButton && (
                                                <>
                                                    {animeAdded ? (
                                                    <button>Added</button>
                                                    ) : (
                                                        <button type="button" onClick={addToList}>Add to list</button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <p style={{ color: "white" }}>Create a list to add animes</p>
                                    )}
                                </>

                              )}
                          </div>
                          <div className={styles.trailer}>
                              <YouTube videoId={animeData.trailer?.youtube_id} opts={opts}/>
                          </div>
                      </div>
                      <div className={styles.synopsis}>
                          <p>{animeData.synopsis}</p>
                      </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className={styles.loader}>
                <SyncLoader color="red" />
            </div>
        )}
        <h3 style={{ color: "white" }}>Reviews</h3>
        <div className={styles.reviews}>
            <div className={styles.reviewsWrapper}>
                <div className={styles.reviewsHeader}>
                    <div className={styles.averageRating}>
                        <h4>{reviews.length > 0 ? averageStars : 0}</h4>
                        <FaStar style={{ color: "gold" }}/>
                    </div>
                    <button onClick={() => setModal(true)}>Write</button>
                </div>
                <div className={styles.reviewsResult}>
                    {reviews.length > 0 ? (
                        <>
                        {reviews.map((review, idx) => {
                            return (
                            // <div className={styles.reviewItem}>
                            //     <div className={styles.reviewItemTop}>
                            //         <div className={styles.reviewItemLeft}>
                            //             <CgProfile style={{ width: "30px", height: "30px" }}/>
                            //             <div className={styles.userDetails}>
                            //                 <p className={styles.username}>{review.Guest == true ? "Anonymous" : review.Username}</p>
                            //                 <p className={styles.date}>{review.createdAt?.slice(0,10)}</p>
                            //             </div>
                            //         </div>
                            //         <div className={styles.reviewItemRight}>
                            //             <div className={styles.reviewRating}>
                            //                 <p>{review.Rating}</p>
                            //                 <FaStar style={{ color: "gold" }}/>
                            //             </div>
                            //         </div>
                            //     </div>
                                    
                            //         <div className={styles.reviewContent}>
                            //             <p>{review.Content}</p>
                            //         </div>
                            //         <div className={styles.reviewVote}>
                            //             <div className={styles.vote}>
                            //                 <p>5</p>
                            //                 <FaArrowAltCircleUp style={{ cursor: "pointer" }} onClick={(() => attemptVote("up", review._id))}/>
                            //             </div>
                            //             <div className={styles.vote}>
                            //                 <p>5</p>
                            //                 <FaArrowAltCircleDown style={{ cursor: "pointer" }} onClick={(() => attemptVote("down", review._id))}/>
                            //             </div>
                            //         </div>

                            // </div>
                            <Review review={review}/>
                            )
                            })}
                        </>
                    ) : (
                        <>
                            <p style={{ color: "white" }}>Be the first to add to review</p>
                        </>
                    )}
                </div>
            </div>
        </div>
        <div className={styles.recommendations}>
                <div className={styles.recommendationsHeader}>
                    <h3>Other recommendations</h3>
                </div>
                <div className={styles.recommendationsResult}>
                    {recommendations?.length > 0 ? (
                        <>
                            {recommendations.map((recommendation, idx) => {
                                return (
                                    <div className={styles.recommendationWrapper} onClick={(() => {
                                        navigate(`/dashboard/${type}/${recommendation.entry?.mal_id}`)
                                    })}>
                                        <img src={recommendation.entry?.images?.jpg?.image_url} alt="" />
                                        <h5>{recommendation.entry.title}</h5>
                                    </div>
                                )
                            })}
                        </>
                    ) : (
                        <p style={{ color: "white" }}>There are no recommendations for this {type} right now</p>
                    )}
                </div>
            </div>
        {modal && <AddReviewModal setModal={setModal} animeId={id}/>}
      
    </div>
  )
}

export default Anime