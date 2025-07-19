import React, { useState, useEffect } from 'react'
import styles from "./animeCard.module.css"
import Axios from "axios"
import { MdClose } from "react-icons/md";
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
        <div className={styles.information}>
            <div className={styles.number}>
                <p style={{ color: "white" }}>{number+1}</p>
            </div>
            <div className={styles.image} onClick={routeAnime}>
                <img src={anime.Img} alt="" />
            </div>
            <div className={styles.content}>
                <h4>{anime.Type}</h4>
                <h3>{anime.Title}</h3>
            </div>
        </div>
        <div className={styles.actions}>
            <MdClose style={{ color: "white", cursor: "pointer" }} onClick={deleteFromList}/>
        </div>
    </div>
  )
}

export default AnimeCard