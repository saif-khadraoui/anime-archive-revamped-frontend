import React, { useState } from 'react'
import styles from "./createListModal.module.css"
import { MdClose } from "react-icons/md";
import Axios from "axios"

function CreateListModal({ setModal }) {
    const userId = localStorage.getItem("userId")
    const [listName, setListName] = useState("")

    const createList = async () => {
        setModal(false)
        await Axios.post("https://anime-archive-revamped.onrender.com/api/createList", {
            userId: userId,
            listName: listName
        }).then((response) => {
            console.log(response)
        })
    }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && setModal(false)}>
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Create New List</h3>
                <button className={styles.closeButton} onClick={() => setModal(false)}>
                    <MdClose size={20} />
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.input}>
                    <p>List Name</p>
                    <input 
                        type="text" 
                        placeholder="Enter list name..."
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                    />
                </div>
                <div className={styles.button}>
                    <button onClick={createList}>Create List</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateListModal