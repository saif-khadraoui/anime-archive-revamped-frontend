import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/searchSong/searchSong.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import ReactPlayer from 'react-player'
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineSearch } from "react-icons/md";

function SearchSong() {

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
    const songPath = "/dashboard/searchSongs"
    const type = (pathname == animePath || songPath) ? "anime" : "manga" 
  
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
  
    const routeAnimeSongs = (animeId) => {
      navigate(`/dashboard/${animeId}/songs`)
    }

  return (
    <div className={styles.container}>

        {/* <ReactPlayer url='https://v.animethemes.moe/Naruto-OP1.webm' playing={true}/> */}

        <Navbar />
      <div className={styles.search}>
        <div className={styles.searchContainer}>
          <div className={styles.filterLetter}>
            {letters.map((letter) => {
              return <p onClick={() => attemptSearch(letter)}>{letter}</p>
            })}
          </div>
          <div className={styles.searchInput}>
            <input type="text" placeholder='search anime' value={search} onChange={((e) => setSearch(e.target.value))} onKeyDown={enterSearch}/>
            <MdOutlineSearch style={{ color: "black", width: "25px", height: "25px", flex: 1, cursor: "pointer" }} onClick={() => attemptSearch(search)}/>
          </div>
        </div>
        <div className={styles.result}>
          {loading ? (
            <>
            {animes.length > 0 ? (
              <>
                {animes?.map((anime, idx) => {
                  return (
                    <div className={styles.animeItem} onClick={() => routeAnimeSongs(anime.mal_id)}>
                      <img src={anime.images?.jpg?.image_url} alt=""/>
                      <p>{anime.title}</p>
                    </div>
                  )
                  })}
                  </>
                ) : (
                  <SyncLoader color="red" />
                  
              )}
            
            </>
          ) : (
            <>
            {/* {pathname == animePath ? (
              <p style={{ color: "white" }}>Search an anime up</p>
            ) : (
              <p style={{ color: "white" }}>Search a manga up</p>
            )} */}
            {pathname == animePath && <p style={{ color: "white" }}>Search an anime up</p>}
            {pathname == mangaPath && <p style={{ color: "white" }}>Search a manga up</p>}
            {pathname == webtoonPath && <p style={{ color: "white" }}>Search a webtoon up</p>}
            {pathname == songPath && <p style={{ color: "white" }}>Search an anime up to see its openings and endings</p>}
            </>
          )}

        </div>
      </div>
    </div>
  )
}

export default SearchSong