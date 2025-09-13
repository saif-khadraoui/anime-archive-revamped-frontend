import React, { useState, useEffect } from 'react'
import styles from "./rightbar.module.css"
import { MdOutlineSearch } from "react-icons/md";
import naruto from "../../../assets/naruto_poster.jpg"
import Axios from "axios"
import { useNavigate } from 'react-router-dom';

function Rightbar() {
    const userId = localStorage.getItem("userId")
    const [animes, setAnimes] = useState([])
    const navigate = useNavigate()


    useEffect(() => {
        const fetchAnimes = async () => {
            await Axios.get("https://api.jikan.moe/v4/top/anime?filter=airing").then((response) => {
                console.log(response)
                setAnimes(response.data.data.slice(0, 2))
            })
        }

        fetchAnimes()
    }, [])

    const routeAnime = (animeId) => {
        navigate(`/dashboard/anime/${animeId}`)
    }

  return (
    <div className={styles.container}>
        <div className={styles.popularAnimes}>
            <h5>Airing Popular Animes</h5>
            {animes.map((anime, idx) => {
                return (
                    <div className={styles.popularAnime}>
                        <img src={anime.images?.jpg?.image_url} alt="" onClick={(() => routeAnime(anime.mal_id))}/>
                        <div className={styles.popularAnimeInfo}>
                            <h6>{anime.title}</h6>
                            <p>Episodes {anime.episodes}</p>
                            <p>{anime.score}/10</p>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Rightbar