import React, { useState, useEffect } from 'react'
import styles from "../../../../ui/dashboard/list/listItem/listItem.module.css"
import Navbar from '../../../../ui/dashboard/navbar/Navbar'
import Axios from "axios";
import { useParams } from 'react-router-dom';
import AnimeCard from '../../../../ui/dashboard/animeCard/AnimeCard';

function ListItem() {
    const { id } = useParams()
    // console.log(id)
    const [listName, setListName] = useState()
    const [list, setList] = useState([])

    useEffect(() => {
        const fetchListItem = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getListItem", {
                params: { id }
            }).then((response) => {
                // console.log(response)
                setListName(response.data[0].ListName)
            })
        }

        fetchListItem()


        const fetchAnimes = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getList", {
                params: { id }
              }).then((response) => {
                // console.log(response)
                setList(response.data)
              })
        }

        fetchAnimes()


    }, [list])


  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.header}>
            <h3>{listName}</h3>
        </div>
        <div className={styles.list}>
          {list.length > 0 ? (
            <>
              {list.map((anime, idx) => {
                return (
                  // <div className={styles.anime}>
                  //   <p style={{color: "white"}}>{anime.AnimeId}</p>
                  // </div>
                  <AnimeCard anime={anime} number={idx} />
                )
              })}
            </>
          ) : (
            <p style={{ color: "white" }}>Your list is empty right now...</p>
          )}
        </div>
    </div>
  )
}

export default ListItem