import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/list/list.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import AnimeCard from '../../../ui/dashboard/animeCard/AnimeCard'
import CreateListModal from '../../../ui/dashboard/list/createListModal/CreateListModal'
import { MdClose, MdPlaylistPlay, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom"

function List() {
  const [lists, setLists] = useState([])
  const userId = localStorage.getItem("userId")
  const [modal, setModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // const fetchList = async () => {
      // await Axios.get("https://anime-archive-revamped.onrender.com/api/getList", {
      //   params: { userId }
      // }).then((response) => {
      //   // console.log(response)
      //   setList(response.data)
      // })
    // }

    // fetchList()

    const fetchLists = async () => {
      await Axios.get("https://anime-archive-revamped.onrender.com/api/getLists", {
        params: { userId }
      }).then((response) => {
        // console.log(response)
        setLists(response.data)
      })
    }

    fetchLists()
  }, [lists, modal])

  const deleteList = async (listId) => {
    await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteList", {
      params: { listId }
    }).then((response) => {
      console.log(response)
    })
  }

  const routeList = (id) => {
    navigate(`/dashboard/list/${id}`)
  }

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Your Lists</h1>
            <p>Organize your favorite anime and manga</p>
          </div>
          <button className={styles.createButton} onClick={() => setModal(true)}>
            <MdPlaylistPlay size={20} />
            Create New List
          </button>
        </div>
        
        <div className={styles.listsContainer}>
          {lists.length > 0 ? (
            <div className={styles.lists}>
              {lists.map((list, idx) => {
                return (
                  <div key={list._id} className={styles.listCard}>
                    <div className={styles.cardContent}>
                      <div className={styles.listIcon}>
                        <MdPlaylistPlay size={24} />
                      </div>
                      <div className={styles.listInfo}>
                        <h3 onClick={() => routeList(list._id)}>{list.ListName}</h3>
                        <p>Click to view contents</p>
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => deleteList(list._id)}
                        title="Delete list"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <MdPlaylistPlay size={64} />
              </div>
              <h3>No Lists Yet</h3>
              <p>Create your first list to start organizing your favorite anime and manga</p>
              <button className={styles.createFirstButton} onClick={() => setModal(true)}>
                <MdPlaylistPlay size={20} />
                Create Your First List
              </button>
            </div>
          )}
        </div>
        
        {modal && <CreateListModal setModal={setModal}/>}
    </div>
  )
}

export default List