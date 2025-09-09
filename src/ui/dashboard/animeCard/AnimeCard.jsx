import React, { useState, useEffect } from 'react'
import styles from "./animeCard.module.css"
import Axios from "axios"
import { MdDelete, MdPlayArrow } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function AnimeCard({ anime, number }) {
    // const [anime, setAnime] = useState()
    const userId = localStorage.getItem("userId")
    const navigate = useNavigate()
    const animeId = anime.AnimeId
    const id = anime._id
    
    // useEffect(() => {
    //     const fetchAnime = async () => {
    //         await Axios.get(`https://api.jikan.moe/v4/anime/${id}/full`).then((response) => {
    //             console.log(response)
    //             setAnime(response.data.data)
    //         })
    //     }

    //     fetchAnime()
    // }, [])

    const deleteFromList = async () => {
        await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteFromList", {
            params: { id }
        }).then((response) => {
            // console.log(response)
            // if(response){
            //     alert("anime removed from list")
            // }
        })
    }

    const routeAnime = () => {
        if(anime.Type == "Anime"){
            navigate(`/dashboard/anime/${anime.AnimeId}`)
        } else{
            navigate(`/dashboard/manga/${anime.AnimeId}`)
        }
    }

  return (
    <div className={styles.container}>
        <div className={styles.cardContent}>
            <div className={styles.imageContainer} onClick={routeAnime}>
                <img src={anime.Img} alt={anime.Title} />
                <div className={styles.imageOverlay}>
                    <MdPlayArrow size={32} />
                </div>
                <div className={styles.numberBadge}>
                    {number + 1}
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.typeBadge}>
                    {anime.Type}
                </div>
                <h3 className={styles.title} onClick={routeAnime}>
                    {anime.Title}
                </h3>
            </div>
        </div>
        <div className={styles.actions}>
            <button 
                className={styles.deleteButton}
                onClick={deleteFromList}
                title="Remove from list"
            >
                <MdDelete size={18} />
            </button>
        </div>
    </div>
  )
}

export default AnimeCard