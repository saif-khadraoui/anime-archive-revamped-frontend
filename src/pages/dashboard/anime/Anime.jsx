import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/anime/anime.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Axios from "axios"
import YouTube, { YouTubeProps } from 'react-youtube';
import { CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { FaStar, FaPlay, FaBookmark, FaUsers, FaCalendarAlt, FaHeart } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";
import { MdAdd, MdCheck } from "react-icons/md";
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
    const [reviewsPagination, setReviewsPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
        hasNextPage: false,
        hasPrevPage: false
    })
    const [amount, setAmount] = useState()
    const [recommendations, setRecommendations] = useState()
    const [lists, setLists] = useState([])
    const [selectedList, setSelectedList] = useState("")
    const [showButton, setShowButton] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteLoading, setFavoriteLoading] = useState(false)

    const [averageStars, setAverageStars] = useState(0)
    
    // Pagination functions
    const handlePageChange = (newPage) => {
        fetchReviews(newPage)
    }

    const handleNextPage = () => {
        if (reviewsPagination.hasNextPage) {
            handlePageChange(reviewsPagination.currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (reviewsPagination.hasPrevPage) {
            handlePageChange(reviewsPagination.currentPage - 1)
        }
    }
    
    // Favorite functions
    const toggleFavorite = async () => {
        if (!userId) return;
        
        setFavoriteLoading(true);
        try {
            if (isFavorite) {
                // Remove from favorites
                await Axios.delete("https://anime-archive-revamped.onrender.com/api/removeFromFavorites", {
                    data: {
                        userId: userId,
                        animeId: animeData.mal_id.toString()
                    }
                });
                setIsFavorite(false);
            } else {
                // Add to favorites
                await Axios.post("https://anime-archive-revamped.onrender.com/api/addToFavorites", {
                    userId: userId,
                    animeId: animeData.mal_id.toString(),
                    title: animeData.title,
                    image: animeData.images?.jpg?.image_url,
                    type: type === "manga" ? "Manga" : "Anime"
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setFavoriteLoading(false);
        }
    };

    const addToList = async() => {
        setAnimeAdded(true)
        // console.log(selectedList)
        
        // Determine the correct type based on the current page path
        let itemType = "Anime" // default
        if (type === "manga") {
            itemType = "Manga"
        } else if (type === "anime") {
            itemType = "Anime"
        }
        
        await Axios.post("https://anime-archive-revamped.onrender.com/api/addToList", {
            selectedList: selectedList,
            userId: userId,
            type: itemType,
            animeId: id,
            img: animeData.images?.jpg?.image_url,
            title: animeData.title
        }).then((response) => {
            // console.log(response)
        })
    }

    const fetchReviews = async (page = 1) => {
        await Axios.get("https://anime-archive-revamped.onrender.com/api/getReviews", {
            params: { id, page, limit: 5 }
        }).then((response) => {
            // console.log(response)
            setReviews(response.data.reviews)
            setReviewsPagination(response.data.pagination)
            // calculateAverageStars()
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

    // Check if anime is in favorites
    useEffect(() => {
        const checkFavorite = async () => {
            if (!userId || !animeData) return;
            
            try {
                const response = await Axios.get("https://anime-archive-revamped.onrender.com/api/getFavorites", {
                    params: { userId }
                });
                
                if (response.data.success) {
                    const isInFavorites = response.data.favorites.some(
                        fav => fav.animeId === animeData.mal_id.toString()
                    );
                    setIsFavorite(isInFavorites);
                }
            } catch (error) {
                console.error("Error checking favorites:", error);
            }
        };

        checkFavorite();
    }, [userId, animeData]);

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
            <>
                {/* Hero Section */}
                <div className={styles.hero}>
                    <div className={styles.heroBackground}>
                        <img src={animeData.images?.jpg?.large_image_url} alt={animeData.title} />
                        <div className={styles.heroOverlay}></div>
                    </div>
                    <div className={styles.heroContent}>
                        <div className={styles.animePoster}>
                            <img src={animeData.images?.jpg?.image_url} alt={animeData.title} />
                        </div>
                        <div className={styles.animeInfo}>
                            <div className={styles.animeHeader}>
                                <h1>{animeData.title}</h1>
                                <div className={styles.animeMeta}>
                                    <span className={styles.type}>{animeData.type}</span>
                                    {animeData.year && <span className={styles.year}>{animeData.year}</span>}
                                    {animeData.episodes && <span className={styles.episodes}>{animeData.episodes} episodes</span>}
                                </div>
                            </div>
                            
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>9.23</div>
                                    <div className={styles.statLabel}>Score</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>{amount}</div>
                                    <div className={styles.statLabel}>In Lists</div>
                                </div>
                                <div className={styles.statItem}>
                                    <div className={styles.statValue}>{reviews.length}</div>
                                    <div className={styles.statLabel}>Reviews</div>
                                </div>
                            </div>

                            {userId && (
                                <div className={styles.addToList}>
                                    {lists.length > 0 ? (
                                        <div className={styles.listSelector}>
                                            <select onChange={updateSelectedList} className={styles.listSelect}>
                                                <option value={undefined}>Select a list</option>
                                                {lists.map((list, idx) => {
                                                    return(
                                                        <option key={list._id} value={list._id}>{list.ListName}</option>
                                                    )
                                                })}
                                            </select>
                                            {showButton && (
                                                <button 
                                                    className={`${styles.addButton} ${animeAdded ? styles.added : ''}`}
                                                    onClick={addToList}
                                                    disabled={animeAdded}
                                                >
                                                    {animeAdded ? (
                                                        <>
                                                            <MdCheck size={16} />
                                                            Added
                                                        </>
                                                    ) : (
                                                        <>
                                                            <MdAdd size={16} />
                                                            Add to List
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className={styles.noListsMessage}>Create a list to add anime</p>
                                    )}
                                </div>
                            )}

                            {userId && (
                                <div className={styles.favoriteSection}>
                                    <button 
                                        className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
                                        onClick={toggleFavorite}
                                        disabled={favoriteLoading}
                                    >
                                        {favoriteLoading ? (
                                            <SyncLoader color="#ffffff" size={8} />
                                        ) : (
                                            <>
                                                <FaHeart size={16} />
                                                {isFavorite ? 'Favorited' : 'Add to Favorites'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className={styles.content}>
                    <div className={styles.mainContent}>
                        {/* Synopsis */}
                        <div className={styles.synopsis}>
                            <h3>Synopsis</h3>
                            <p>{animeData.synopsis}</p>
                        </div>

                        {/* Trailer */}
                        {animeData.trailer?.youtube_id && (
                            <div className={styles.trailer}>
                                <h3>Trailer</h3>
                                <div className={styles.trailerContainer}>
                                    <YouTube videoId={animeData.trailer?.youtube_id} opts={opts}/>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className={styles.reviews}>
                        <div className={styles.reviewsHeader}>
                            <div className={styles.reviewsTitle}>
                                <h3>Reviews</h3>
                                <div className={styles.averageRating}>
                                    <span className={styles.ratingValue}>{reviews.length > 0 ? averageStars.toFixed(1) : '0.0'}</span>
                                    <FaStar className={styles.starIcon} />
                                    <span className={styles.ratingCount}>({reviews.length} reviews)</span>
                                </div>
                            </div>
                            <button className={styles.writeReviewButton} onClick={() => setModal(true)}>
                                <FaStar size={16} />
                                Write Review
                            </button>
                        </div>
                        
                        <div className={styles.reviewsList}>
                            {reviews.length > 0 ? (
                                reviews.map((review, idx) => (
                                    <Review key={review._id} review={review}/>
                                ))
                            ) : (
                                <div className={styles.noReviews}>
                                    <FaStar size={48} />
                                    <h4>No reviews yet</h4>
                                    <p>Be the first to share your thoughts about this anime</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {reviewsPagination.totalPages > 1 && (
                            <div className={styles.pagination}>
                                <div className={styles.paginationInfo}>
                                    <span>
                                        Showing {((reviewsPagination.currentPage - 1) * 5) + 1} to {Math.min(reviewsPagination.currentPage * 5, reviewsPagination.totalReviews)} of {reviewsPagination.totalReviews} reviews
                                    </span>
                                </div>
                                <div className={styles.paginationControls}>
                                    <button 
                                        className={`${styles.paginationButton} ${!reviewsPagination.hasPrevPage ? styles.paginationButtonDisabled : ''}`}
                                        onClick={handlePrevPage}
                                        disabled={!reviewsPagination.hasPrevPage}
                                    >
                                        Previous
                                    </button>
                                    
                                    <div className={styles.pageNumbers}>
                                        {Array.from({ length: reviewsPagination.totalPages }, (_, i) => i + 1).map(pageNum => (
                                            <button
                                                key={pageNum}
                                                className={`${styles.pageNumber} ${pageNum === reviewsPagination.currentPage ? styles.pageNumberActive : ''}`}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        className={`${styles.paginationButton} ${!reviewsPagination.hasNextPage ? styles.paginationButtonDisabled : ''}`}
                                        onClick={handleNextPage}
                                        disabled={!reviewsPagination.hasNextPage}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className={styles.recommendations}>
                        <h3>Similar {type === 'anime' ? 'Anime' : 'Manga'}</h3>
                        <div className={styles.recommendationsGrid}>
                            {recommendations?.length > 0 ? (
                                recommendations.map((recommendation, idx) => (
                                    <div 
                                        key={recommendation.entry?.mal_id}
                                        className={styles.recommendationCard} 
                                        onClick={() => navigate(`/dashboard/${type}/${recommendation.entry?.mal_id}`)}
                                    >
                                        <div className={styles.recommendationImage}>
                                            <img src={recommendation.entry?.images?.jpg?.image_url} alt={recommendation.entry?.title} />
                                            <div className={styles.recommendationOverlay}>
                                                <FaPlay size={24} />
                                            </div>
                                        </div>
                                        <h5>{recommendation.entry?.title}</h5>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noRecommendations}>
                                    <FaBookmark size={48} />
                                    <p>No recommendations available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className={styles.loader}>
                <SyncLoader color="#667eea" />
            </div>
        )}
        
        {modal && <AddReviewModal setModal={setModal} animeId={id}/>}
    </div>
  )
}

export default Anime