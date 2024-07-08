import React, { useState } from 'react'
import styles from "./createListModal.module.css"
import { MdClose } from "react-icons/md";
import Axios from "axios"

function CreateListModal({ setModal }) {
    const userId = localStorage.getItem("userId")
    const [listName, setListName] = useState("")

    const createList = async () => {
        await Axios.post("https://anime-archive-revamped.onrender.com/api/createList", {
            userId: userId,
            listName: listName
        }).then((response) => {
            console.log(response)
        })
    }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <MdClose onClick={(() => setModal(false))} style={{ color: "white", cursor: "pointer" }}/>
        </div>
        <div className={styles.content}>
            <div className={styles.input}>
                <p>List name</p>
                <input type="text" onChange={((e) => setListName(e.target.value))}/>
            </div>
            <button onClick={createList}>Add list</button>
        </div>
    </div>
  )
}

export default CreateListModal