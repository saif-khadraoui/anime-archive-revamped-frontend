import React, { useEffect, useState } from 'react'
import styles from "../../../ui/dashboard/songs/songs.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import { useParams, useNavigate } from 'react-router-dom'

function Songs() {
    const [songs, setSongs] = useState([])
    const [animeTitle, setAnimeTitle] = useState()
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSongs = async () => {
            await Axios.get(`https://api.animethemes.moe/anime?include=animesynonyms,series,animethemes,animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists,studios,images,resources&fields%5Banime%5D=id,name,slug,year&filter%5Bhas%5D=resources&filter%5Bsite%5D=myanimelist&filter%5Bexternal_id%5D=${id}`).then((response) => {
                console.log(response)
                setSongs(response.data.anime[0]?.animethemes)
                setAnimeTitle(response.data.anime[0]?.name)
            })
        }

        fetchSongs()
    }, [])

    const routeSong = (basename) => {
        navigate(`/dashboard/${id}/${basename}`)
    }

  return (
    <div className={styles.container}>
        <Navbar />
        <h2>{animeTitle}</h2>
        <div className={styles.songs}>
            {songs?.length > 0 ? (
                <>
                    {songs.map((song, idx) => {
                        return (
                            <div className={styles.song} onClick={(() => routeSong(song.animethemeentries[0].videos[0].basename))}>
                                <div className={styles.songNames}>
                                    <p style={{  color: "white" }}>{song.slug}</p>
                                    <p style={{  color: "white" }}>Episodes: {song.animethemeentries[0].episodes}</p>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : (
                <p style={{ color: "white" }}>There are no openings/endings for this anime right now unfortunately</p>
            )}
        </div>
    </div>
  )
}

export default Songs