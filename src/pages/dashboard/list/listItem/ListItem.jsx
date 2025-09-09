import React, { useState, useEffect } from 'react'
import styles from "../../../../ui/dashboard/list/listItem/listItem.module.css"
import Navbar from '../../../../ui/dashboard/navbar/Navbar'
import Axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import AnimeCard from '../../../../ui/dashboard/animeCard/AnimeCard';
import { MdArrowBack, MdPlaylistPlay } from "react-icons/md";

function ListItem() {
    const { id } = useParams()
    const navigate = useNavigate()
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
            <button className={styles.backButton} onClick={() => navigate('/dashboard/list')}>
                <MdArrowBack size={20} />
                Back to Lists
            </button>
            <div className={styles.headerContent}>
                <div className={styles.listIcon}>
                    <MdPlaylistPlay size={32} />
                </div>
                <div className={styles.listInfo}>
                    <h1>{listName}</h1>
                    <p>{list.length} {list.length === 1 ? 'item' : 'items'} in this list</p>
                </div>
            </div>
        </div>
        
        <div className={styles.content}>
          {list.length > 0 ? (
            <div className={styles.animeGrid}>
              {list.map((anime, idx) => {
                return (
                  <AnimeCard key={anime._id} anime={anime} number={idx} />
                )
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                    <MdPlaylistPlay size={64} />
                </div>
                <h3>This list is empty</h3>
                <p>Add some anime or manga to get started</p>
            </div>
          )}
        </div>
    </div>
  )
}

export default ListItem