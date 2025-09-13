import React, { useState, useEffect } from 'react'
import styles from "./thread.module.css"
import { CgProfile } from "react-icons/cg";
import { FaThumbsUp, FaThumbsDown, FaReply, FaComment } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Axios from "axios"

function Thread({ thread, userId, onReplyAdded }) {
    const navigate = useNavigate()
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    const [votingLoading, setVotingLoading] = useState(false)
    const [userVote, setUserVote] = useState(null)
    const [likes, setLikes] = useState(thread.Likes || 0)
    const [dislikes, setDislikes] = useState(thread.Dislikes || 0)
    const [displayedReplies, setDisplayedReplies] = useState(thread.Replies || [])
    const [replyPagination, setReplyPagination] = useState(thread.replyPagination || {
        totalReplies: 0,
        displayedReplies: 0,
        hasMoreReplies: false
    })
    const [loadingMoreReplies, setLoadingMoreReplies] = useState(false)
    const [addingReply, setAddingReply] = useState(false)

    useEffect(() => {
        if (userId) {
            checkUserVote()
        }
    }, [userId, thread._id])

    // Initialize local state with thread data on component mount
    useEffect(() => {
        setDisplayedReplies(thread.Replies || [])
        setReplyPagination(thread.replyPagination || {
            totalReplies: 0,
            displayedReplies: 0,
            hasMoreReplies: false
        })
    }, []) // Only run on mount

    const checkUserVote = async () => {
        try {
            const response = await Axios.get("https://anime-archive-revamped.onrender.com/api/checkThreadVote", {
                params: { threadId: thread._id, userId }
            })
            setUserVote(response.data.vote)
        } catch (error) {
            console.error("Error checking vote:", error)
        }
    }

    const handleVote = async (voteType) => {
        if (!userId || votingLoading) return
        
        try {
            setVotingLoading(true)
            
            if (userVote === voteType) {
                // Remove vote
                await Axios.delete("https://anime-archive-revamped.onrender.com/api/removeThreadVote", {
                    params: { threadId: thread._id, userId }
                })
                setUserVote(null)
                if (voteType) {
                    setLikes(likes - 1)
                } else {
                    setDislikes(dislikes - 1)
                }
            } else {
                // Add/change vote
                await Axios.post("https://anime-archive-revamped.onrender.com/api/voteThread", {
                    threadId: thread._id,
                    userId: userId,
                    vote: voteType
                })
                
                // Update counts
                if (userVote === null) {
                    // New vote
                    if (voteType) {
                        setLikes(likes + 1)
                    } else {
                        setDislikes(dislikes + 1)
                    }
                } else {
                    // Changed vote
                    if (voteType) {
                        setLikes(likes + 1)
                        setDislikes(dislikes - 1)
                    } else {
                        setLikes(likes - 1)
                        setDislikes(dislikes + 1)
                    }
                }
                
                setUserVote(voteType)
            }
        } catch (error) {
            console.error("Error voting:", error)
        } finally {
            setVotingLoading(false)
        }
    }

    const handleReply = async () => {
        if (!replyContent.trim() || !userId || addingReply) return
        
        try {
            setAddingReply(true)
            const userDetails = {
                authorId: userId,
                authorUsername: localStorage.getItem("username"),
                authorProfilePic: localStorage.getItem("profilePic") || ""
            }
            
            const response = await Axios.post("https://anime-archive-revamped.onrender.com/api/addReply", {
                threadId: thread._id,
                content: replyContent,
                replyToId: replyingTo,
                ...userDetails
            })
            
            if (response.data.success) {
                console.log("Reply added successfully, response:", response.data)
                
                // Use the updated thread data from the backend response
                const updatedThread = response.data.thread
                
                if (updatedThread && updatedThread.Replies) {
                    console.log("Updated thread replies:", updatedThread.Replies.length)
                    
                    // Get the latest 10 replies (newest first)
                    const latestReplies = updatedThread.Replies
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 10)
                    
                    console.log("Setting latest replies:", latestReplies.length)
                    
                    // Update displayed replies with the latest data
                    setDisplayedReplies(latestReplies)
                    
                    // Update pagination info
                    setReplyPagination({
                        totalReplies: updatedThread.Replies.length,
                        displayedReplies: latestReplies.length,
                        hasMoreReplies: updatedThread.Replies.length > 10
                    })
                } else {
                    console.log("No updated thread or replies in response, using fallback")
                    // Fallback: add the reply manually to local state
                    const newReply = {
                        Content: replyContent,
                        AuthorId: userId,
                        AuthorUsername: userDetails.authorUsername,
                        AuthorProfilePic: userDetails.authorProfilePic,
                        ReplyToId: replyingTo,
                        createdAt: new Date().toISOString()
                    }
                    
                    setDisplayedReplies(prev => [newReply, ...prev])
                    setReplyPagination(prev => ({
                        ...prev,
                        totalReplies: prev.totalReplies + 1,
                        displayedReplies: prev.displayedReplies + 1,
                        hasMoreReplies: (prev.displayedReplies + 1) < (prev.totalReplies + 1)
                    }))
                }
                
                setReplyContent("")
                setShowReplyForm(false)
                setReplyingTo(null)
                
                // Notify parent component to refresh threads (for thread count update)
                if (onReplyAdded) {
                    onReplyAdded(thread._id)
                }
            }
        } catch (error) {
            console.error("Error adding reply:", error)
        } finally {
            setAddingReply(false)
        }
    }

    const refreshThreadData = async () => {
        try {
            // Fetch the latest thread data including all replies
            const response = await Axios.get("https://anime-archive-revamped.onrender.com/api/getMoreReplies", {
                params: { 
                    threadId: thread._id, 
                    skip: 0, 
                    limit: 1000 // Get all replies
                }
            })
            
            if (response.data.success) {
                // Update with the latest replies (sorted newest first)
                setDisplayedReplies(response.data.replies)
                setReplyPagination(response.data.pagination)
            }
        } catch (error) {
            console.error("Error refreshing thread data:", error)
        }
    }

    const loadMoreReplies = async () => {
        if (loadingMoreReplies || !replyPagination.hasMoreReplies) return
        
        try {
            setLoadingMoreReplies(true)
            const currentSkip = displayedReplies.length
            
            const response = await Axios.get("https://anime-archive-revamped.onrender.com/api/getMoreReplies", {
                params: { 
                    threadId: thread._id, 
                    skip: currentSkip, 
                    limit: 10 
                }
            })
            
            if (response.data.success) {
                setDisplayedReplies(prev => [...prev, ...response.data.replies])
                setReplyPagination(response.data.pagination)
            }
        } catch (error) {
            console.error("Error loading more replies:", error)
        } finally {
            setLoadingMoreReplies(false)
        }
    }

    const handleUsernameClick = (username) => {
        navigate(`/dashboard/public-profile/${username}`)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className={styles.thread}>
            {/* Thread Header */}
            <div className={styles.threadHeader}>
                <div className={styles.authorInfo}>
                    <CgProfile className={styles.profileIcon} />
                    <div className={styles.authorDetails}>
                        <span 
                            className={styles.authorName}
                            onClick={() => handleUsernameClick(thread.AuthorUsername)}
                        >
                            {thread.AuthorUsername}
                        </span>
                        <span className={styles.threadDate}>
                            {formatDate(thread.createdAt)}
                        </span>
                    </div>
                </div>
                <div className={styles.threadStats}>
                    <span className={styles.replyCount}>
                        <FaComment size={14} />
                        {replyPagination.totalReplies || 0}
                    </span>
                </div>
            </div>

            {/* Thread Content */}
            <div className={styles.threadContent}>
                <h3 className={styles.threadTitle}>{thread.Title}</h3>
                <p className={styles.threadText}>{thread.Content}</p>
            </div>

            {/* Thread Actions */}
            <div className={styles.threadActions}>
                <div className={styles.voteButtons}>
                    <button 
                        className={`${styles.voteButton} ${userVote === true ? styles.voteButtonActive : ''} ${votingLoading ? styles.voteButtonDisabled : ''}`}
                        onClick={() => handleVote(true)}
                        disabled={votingLoading}
                    >
                        <FaThumbsUp size={16} />
                        <span>{likes}</span>
                    </button>
                    <button 
                        className={`${styles.voteButton} ${userVote === false ? styles.voteButtonActive : ''} ${votingLoading ? styles.voteButtonDisabled : ''}`}
                        onClick={() => handleVote(false)}
                        disabled={votingLoading}
                    >
                        <FaThumbsDown size={16} />
                        <span>{dislikes}</span>
                    </button>
                </div>
                
                {userId && (
                    <button 
                        className={styles.replyButton}
                        onClick={() => {
                            setShowReplyForm(!showReplyForm)
                            setReplyingTo(null)
                        }}
                    >
                        <FaReply size={14} />
                        Reply
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {showReplyForm && userId && (
                <div className={styles.replyForm}>
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className={styles.replyTextarea}
                        rows={3}
                        disabled={addingReply}
                    />
                    <div className={styles.replyActions}>
                        <button 
                            className={styles.cancelButton}
                            onClick={() => {
                                setShowReplyForm(false)
                                setReplyContent("")
                                setReplyingTo(null)
                            }}
                            disabled={addingReply}
                        >
                            Cancel
                        </button>
                        <button 
                            className={styles.submitButton}
                            onClick={handleReply}
                            disabled={!replyContent.trim() || addingReply}
                        >
                            {addingReply ? (
                                <>
                                    <div className={styles.loadingSpinner}></div>
                                    Adding...
                                </>
                            ) : (
                                "Reply"
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Replies */}
            {displayedReplies && displayedReplies.length > 0 && (
                <div className={styles.replies}>
                    {displayedReplies.map((reply, index) => (
                        <div key={index} className={styles.reply}>
                            <div className={styles.replyHeader}>
                                <CgProfile className={styles.replyProfileIcon} />
                                <div className={styles.replyAuthorDetails}>
                                    <span 
                                        className={styles.replyAuthorName}
                                        onClick={() => handleUsernameClick(reply.AuthorUsername)}
                                    >
                                        {reply.AuthorUsername}
                                    </span>
                                    <span className={styles.replyDate}>
                                        {formatDate(reply.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.replyContent}>
                                <p>{reply.Content}</p>
                            </div>
                            {userId && (
                                <button 
                                    className={styles.replyToButton}
                                    onClick={() => {
                                        setShowReplyForm(true)
                                        setReplyingTo(reply.AuthorId)
                                        setReplyContent(`@${reply.AuthorUsername} `)
                                    }}
                                >
                                    <FaReply size={12} />
                                    Reply
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {/* Load More Replies Button */}
                    {replyPagination.hasMoreReplies && (
                        <div className={styles.loadMoreReplies}>
                            <button 
                                className={styles.loadMoreButton}
                                onClick={loadMoreReplies}
                                disabled={loadingMoreReplies}
                            >
                                {loadingMoreReplies ? (
                                    <>
                                        <div className={styles.loadingSpinner}></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <FaComment size={14} />
                                        Load More Replies ({replyPagination.totalReplies - replyPagination.displayedReplies} remaining)
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Thread
