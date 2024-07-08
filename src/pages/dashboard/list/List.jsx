import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/list/list.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import AnimeCard from '../../../ui/dashboard/animeCard/AnimeCard'
import CreateListModal from '../../../ui/dashboard/list/createListModal/CreateListModal'
import { MdClose } from "react-icons/md";
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
          <h3>Your lists</h3>
          <button onClick={(() => setModal(true))}>Create list</button>
        </div>
        {/* <div className={styles.list}>
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
        </div> */}
        <div className={styles.lists}>
          {lists.length > 0 ? (
            <>
              {lists.map((list, idx) => {
                return (
                  <div className={styles.listCard}>
                    <h4 onClick={(() => routeList(list._id))}>{list.ListName}</h4>
                    <MdClose style={{ color: "white", cursor: "pointer" }} onClick={(() => deleteList(list._id))}/>
                  </div>
                )
              })}
            </>
          ) : (
            <p style={{ color: "white" }}>You have no lists right now...</p>
          )}
        </div>
        {modal && <CreateListModal setModal={setModal}/>}
    </div>
  )
}

export default List