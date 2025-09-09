import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/search/search.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import { MdOutlineSearch, MdPlayArrow, MdBook, MdImage } from "react-icons/md";
import Axios from "axios"
import { CSSProperties } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate, useLocation } from 'react-router-dom';

function Search() {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  const [animes, setAnimes] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  console.log(pathname)
  const animePath = "/dashboard/searchAnime"
  const mangaPath = "/dashboard/searchManga"
  const webtoonPath = "/dashboard/searchWebtoon"
  const type = (pathname == animePath) ? "anime" : "manga" 

  // useEffect(() => {
  //   setAnimes([])
  // }, [])

  const enterSearch = async (event) => {
    if (event.key == "Enter"){
      await attemptSearch(search)
    }
  }

  const attemptSearch = (query) => {
    setLoading(true)
    setAnimes([])
    console.log(query)

    const fetchAnimes = async () => {
      await Axios.get(`https://api.jikan.moe/v4/${type}?q=${query}&limit=${pathname == webtoonPath ? 20 : 10}`).then((response) => {
        console.log(response.data.data)
        // let arr = response.data.data.map(item => item.filter(e => e.type !== "Manhwa"))
        // let arr = response.data.data.filter(function(value){
        //   return value.type == "Manhwa"
        // })
        // console.log(arr)
        if(pathname == webtoonPath){
          let data = response.data.data.filter(function(value){return value.type == "Manhwa"})

          if(data.length > 0){
            setAnimes(data)
          } else{
            alert("no data found")
            setLoading(false)
          }
        } else{
          if(response.data.data.length > 0){
            setAnimes(response.data.data)
          } else{
            alert("no data found")
            setLoading(false)
          }
        }
        // if(response.data.data.length > 0){
        //   if(pathname == webtoonPath){
        //     setAnimes(response.data.data.filter(function(value){
        //       return value.type == "Manhwa"
        //     }))
        //   } else{
        //     setAnimes(response.data.data)
        //   }
        // } else{
        //   console.log("nothing found")
        //   setAnimes([])
        //   alert("no animes were found")
        //   setLoading(false)
        // }
        
        // setLoading(false)
      })
    }

    fetchAnimes()
  }

  // useEffect(() => {
  //   console.log(search)
  // }, [attemptSearch])

  const routeAnime = (animeId) => {
    navigate(`/dashboard/${type}/${animeId}`)
  }



  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.search}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>
              {pathname === animePath && "Search Anime"}
              {pathname === mangaPath && "Search Manga"}
              {pathname === webtoonPath && "Search Webtoons"}
            </h1>
            <p>Discover your next favorite {pathname === animePath ? "anime" : pathname === mangaPath ? "manga" : "webtoon"}</p>
          </div>
        </div>

        {/* Search Section */}
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <div className={styles.searchInput}>
              <input 
                type="text" 
                placeholder={`Search ${pathname === animePath ? "anime" : pathname === mangaPath ? "manga" : "webtoons"}...`}
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                onKeyDown={enterSearch}
              />
              <button className={styles.searchButton} onClick={() => attemptSearch(search)}>
                <MdOutlineSearch size={20} />
              </button>
            </div>
            
            <div className={styles.filterLetter}>
              <span className={styles.filterLabel}>Quick Search:</span>
              <div className={styles.letterGrid}>
                {letters.map((letter, index) => {
                  return (
                    <button 
                      key={index}
                      className={styles.letterButton} 
                      onClick={() => attemptSearch(letter)}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className={styles.resultsSection}>
          {loading ? (
            <div className={styles.loadingContainer}>
              {animes.length > 0 ? (
                <div className={styles.resultsGrid}>
                  {animes.map((anime, idx) => {
                    return (
                      <div 
                        key={anime.mal_id}
                        className={styles.resultCard} 
                        onClick={() => routeAnime(anime.mal_id)}
                      >
                        <div className={styles.cardImage}>
                          <img src={anime.images?.jpg?.image_url} alt={anime.title}/>
                          <div className={styles.imageOverlay}>
                            {pathname === animePath ? (
                              <MdPlayArrow size={32} />
                            ) : (
                              <MdBook size={32} />
                            )}
                          </div>
                        </div>
                        <div className={styles.cardContent}>
                          <h3>{anime.title}</h3>
                          <div className={styles.cardMeta}>
                            <span className={styles.type}>{anime.type}</span>
                            {anime.year && <span className={styles.year}>{anime.year}</span>}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className={styles.loadingSpinner}>
                  <SyncLoader color="#667eea" />
                  <p>Searching...</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                {pathname === animePath ? (
                  <MdPlayArrow size={64} />
                ) : pathname === mangaPath ? (
                  <MdBook size={64} />
                ) : (
                  <MdImage size={64} />
                )}
              </div>
              <h3>Start Your Search</h3>
              <p>
                {pathname === animePath && "Search for your favorite anime or browse by letter"}
                {pathname === mangaPath && "Search for your favorite manga or browse by letter"}
                {pathname === webtoonPath && "Search for your favorite webtoons or browse by letter"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search