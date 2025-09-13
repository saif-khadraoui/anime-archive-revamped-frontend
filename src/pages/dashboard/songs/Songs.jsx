import React, { useEffect, useState } from 'react'
import styles from "../../../ui/dashboard/songs/songs.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import { useParams, useNavigate } from 'react-router-dom'
import { MdMusicNote, MdPlayArrow, MdArrowBack } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";

function Songs() {
    const [songs, setSongs] = useState([])
    const [animeTitle, setAnimeTitle] = useState()
    const [loading, setLoading] = useState(true)
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setLoading(true)
                await Axios.get(`https://api.animethemes.moe/anime?include=animesynonyms,series,animethemes,animethemes.animethemeentries.videos,animethemes.song,animethemes.song.artists,studios,images,resources&fields%5Banime%5D=id,name,slug,year&filter%5Bhas%5D=resources&filter%5Bsite%5D=myanimelist&filter%5Bexternal_id%5D=${id}`).then((response) => {
                    console.log(response)
                    setSongs(response.data.anime[0]?.animethemes)
                    setAnimeTitle(response.data.anime[0]?.name)
                })
            } catch (error) {
                console.error("Error fetching songs:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSongs()
    }, [id])

    const routeSong = (basename) => {
        navigate(`/dashboard/${id}/${basename}`, { 
            state: { fromPage: 'songs' } 
        })
    }

  return (
    <div className={styles.container}>
        <Navbar />
        
        {/* Header Section */}
        <div className={styles.header}>
            <button className={styles.backButton} onClick={() => navigate('/dashboard/searchSongs')}>
                <MdArrowBack size={20} />
                Back to Search
            </button>
            <div className={styles.headerContent}>
                <div className={styles.animeIcon}>
                    <MdMusicNote size={32} />
                </div>
                <div className={styles.animeInfo}>
                    <h1>{animeTitle}</h1>
                    <p>Openings & Endings</p>
                </div>
            </div>
        </div>

        {/* Songs Section */}
        <div className={styles.songsSection}>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <SyncLoader color="#667eea" />
                    <p>Loading songs...</p>
                </div>
            ) : songs?.length > 0 ? (
                <div className={styles.songsGrid}>
                    {songs.map((song, idx) => {
                        return (
                            <div 
                                key={idx}
                                className={styles.songCard} 
                                onClick={() => routeSong(song.animethemeentries[0].videos[0].basename)}
                            >
                                <div className={styles.cardContent}>
                                    <div className={styles.songIcon}>
                                        <MdPlayArrow size={24} />
                                    </div>
                                    <div className={styles.songInfo}>
                                        <h3>{song.slug}</h3>
                                        <p>Episodes: {song.animethemeentries[0].episodes}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <MdMusicNote size={64} />
                    </div>
                    <h3>No Songs Available</h3>
                    <p>There are no openings or endings for this anime right now</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default Songs