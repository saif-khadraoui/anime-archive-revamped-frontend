import React, { useState, useEffect } from 'react'
import styles from "../../../ui/dashboard/song/song.module.css"
import Navbar from '../../../ui/dashboard/navbar/Navbar'
import Axios from "axios"
import { useParams } from "react-router-dom"
import ReactPlayer from 'react-player'
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";

function Song() {
    const {id, basename} = useParams()
    const [link, setLink] = useState()
    const userId = localStorage.getItem("userId")

    const [update, setUpdate] = useState(false)

    const [upVotes, setUpVotes] = useState()
    const [downVotes, setDownVotes] = useState()
    const [upVoteIsTrue, setUpVoteIsTrue] = useState(false)
    const [downVoteIsTrue, setDownVoteIsTrue] = useState(false)

    const attemptVote = async (type) => {
        console.log(type)
        console.log(downVoteIsTrue)


        if(type == "up" && upVoteIsTrue == true || type == "down" && downVoteIsTrue == true){
            console.log("here")
            await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteSongVote", {
                params: { basename, userId }
            }).then((response) => {
                console.log(response)
                setUpdate(!update)
            })
        }

        else if (type == "up" && downVoteIsTrue == true || type == "down" && upVoteIsTrue == true){
            await Axios.delete("https://anime-archive-revamped.onrender.com/api/deleteSongVote", {
                params: { basename, userId }
            }).then((response) => {
                console.log(response)
            })
            await Axios.post("https://anime-archive-revamped.onrender.com/api/addSongVote", {
                animeId: id,
                basename: basename,
                userId: userId,
                vote: type == "up" ? true : false
        }).then((response) => {
            console.log(response)
            setUpdate(!update)
        })
        } else{
            await Axios.post("https://anime-archive-revamped.onrender.com/api/addSongVote", {
                animeId: id,
                basename: basename,
                userId: userId,
                vote: type == "up" ? true : false
            }).then((response) => {
                console.log(response)
                setUpdate(!update)
            })
        }




    }

    useEffect(() => {
        const getVotes = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/getSongVotes" , {
                params: { basename }
            }).then((response) => {
                // console.log(response)
                setUpVotes(response.data.upVotes)
                setDownVotes(response.data.downVotes)
            })
        }

        getVotes()

        const checkIfVoted = async () => {
            await Axios.get("https://anime-archive-revamped.onrender.com/api/checkIfSongVoted", {
                params: { basename, userId }
            }).then((response) => {
                // console.log(response)
                if(response.data[0]?.Vote == true){
                    setUpVoteIsTrue(true)
                    setDownVoteIsTrue(false)
                } 

                if(response.data[0]?.Vote == false){
                    setDownVoteIsTrue(true)
                    setUpVoteIsTrue(false)
                } 
            })
        }

        checkIfVoted()

    }, [update])


    useEffect(() => {
        const fetchSong = async () => {
            await Axios.get(`https://api.animethemes.moe/video/${basename}`).then((response) => {
                console.log(response)
                setLink(response.data.video.link)
            })
        }
        fetchSong()
    }, [])

    // const addVote = async (type) => {
    //     await Axios.post("https://anime-archive-revamped.onrender.com/api/addSongVote", {
    //         userId: userId,
    //         basename: basename,
    //         vote: type == "up" ? true : false
    //     }).then((response) => {
    //         console.log(response)
    //     })
    // }

  return (
    <div className={styles.container}>
        <Navbar />
        <div className={styles.song}>
            <ReactPlayer url={link} playing={false} controls={true} width="75%"/>
            <div className={styles.buttons}>
                <button onClick={(() => attemptVote("up"))}><AiOutlineLike style={{ width: "18px", height: "16px", color: upVoteIsTrue ? "black" : "white" }}/>{upVotes}</button>
                <button onClick={(() => attemptVote("down"))}><AiOutlineDislike style={{ width: "18px", height: "16px", color: downVoteIsTrue ? "black" : "white" }}/>{downVotes}</button>
            </div>
        </div>
        <div className={styles.songComments}>
            <h4>Comments</h4>
        </div>
    </div>
  )
}

export default Song