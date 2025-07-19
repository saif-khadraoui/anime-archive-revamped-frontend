import React, { useContext, useEffect } from 'react'
import styles from "./sidebar.module.css"
import { MdHome, MdOutlineSearch, MdOutlineSettings, MdChecklistRtl, MdClose } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { BiSolidSlideshow } from "react-icons/bi";
import MenuLink from './menuLink/MenuLink';
import { IoLogOutOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdMenuBook } from "react-icons/md";
import UserContext from "../../../contexts/User"
import { useNavigate } from 'react-router-dom';
import { IoMusicalNotesOutline } from "react-icons/io5";
import { MdQueueMusic } from "react-icons/md";

function Sidebar() {
    const menuItems = [
      {
        title: "MENU",
        list: [
          {
            title: "Home",
            path: "/",
            icon: <MdHome />,
          },
          {
            title: "Search anime",
            path: `/dashboard/searchAnime`,
            icon: <BiSolidSlideshow />
          },
          {
            title: "Search manga",
            path: `/dashboard/searchManga`,
            icon: <ImBooks />
          },
          {
            title: "Search webtoon",
            path: `/dashboard/searchWebtoon`,
            icon: <MdMenuBook />
          },
            // {
            //   title: "Assets",
            //   path: `/dashboard/assets`,
            //   icon: <MdSupervisedUserCircle />,
            // }
          ],
        },
        {
          title: "MUSIC",
          list: [
            {
              title: "Search songs",
              path: "/dashboard/searchSongs",
              icon: <IoMusicalNotesOutline />,
            },
            {
              title: "Top songs ",
              path: `/dashboard/topSongs`,
              icon: <MdQueueMusic />
            }
          ],
        },
        {
            title: "GENERAL",
            list: [
              {
                title: "Settings",
                path: "/dashboard/settings",
                icon: <MdOutlineSettings />,
              },
              // {
              //   title: "Logout",
              //   path: `/dashboard`,
              //   icon: <IoLogOutOutline />
              // }
            ],
          },
      ];

      const userMenuItems = [
        {
          title: "MENU",
          list: [
            {
              title: "Home",
              path: "/",
              icon: <MdHome />,
            },
            {
              title: "Search anime",
              path: `/dashboard/searchAnime`,
              icon: <BiSolidSlideshow />
            },
            {
              title: "Search manga",
              path: `/dashboard/searchManga`,
              icon: <ImBooks />
            },
            {
              title: "Search webtoon",
              path: `/dashboard/searchWebtoon`,
              icon: <MdMenuBook />
            },
            // {
            //   title: "Assets",
            //   path: `/dashboard/assets`,
            //   icon: <MdSupervisedUserCircle />,
            // }
          ],
        },
        {
          title: "MUSIC",
          list: [
            {
              title: "Search songs",
              path: "/dashboard/searchSongs",
              icon: <IoMusicalNotesOutline />,
            },
            {
              title: "Top songs ",
              path: `/dashboard/topSongs`,
              icon: <MdQueueMusic />
            }
          ],
        },
        {
            title: "GENERAL",
            list: [
              {
                title: "List",
                path: "/dashboard/list",
                icon: <MdChecklistRtl />,
              },
              {
                title: "Settings",
                path: "/dashboard/settings",
                icon: <MdOutlineSettings />,
              },
              // {
              //   title: "Logout",
              //   path: `/dashboard`,
              //   icon: <IoLogOutOutline />
              // }
            ],
          },
      ];

      const { setUserId, setUsername, setEmail, setProfilePic } = useContext(UserContext)
      const userId = localStorage.getItem("userId")
      const mobile = localStorage.getItem("mobile")
      const navigate = useNavigate()

    
      const attemptLogout = (e) => {
        // e.preventDefault()
        document.getElementById("mobileContainer").style.display = "none"
        setUserId("")
        setUsername("")
        setEmail("")
        setProfilePic("")
        navigate("/")

      }

      const closeMobile = () => {
        localStorage.setItem("mobile", "false")
        document.getElementById("mobileContainer").style.display = "none"
      }

  return (
    <>
      <div className={styles.container}>
          <div className={styles.logo}><span className={styles.logoSpan}>AA </span> Anime Archive</div>
          <ul className={styles.list}>
            {userId ? (
              <>
                {userMenuItems.map(category=>(
                  <li key={category.title}>
                      <span className={styles.category}>{category.title}</span>
                      {category.list.map(item=>(
                          <MenuLink item={item} key={item}/>
                      ))}
                  </li>
                ))}
              </>
            ) : (
              <>
                {menuItems.map(category=>(
                  <li key={category.title}>
                      <span className={styles.category}>{category.title}</span>
                      {category.list.map(item=>(
                          <MenuLink item={item} key={item}/>
                      ))}
                  </li>
                ))}
              </>
            )}
              {userId && <button onClick={attemptLogout} className={styles.logoutButton}>Logout</button>}
          </ul>
      </div>
      <div className={styles.mobileContainer} id="mobileContainer">
        <div className={styles.mobileHeader}>
          <div className={styles.logo}><span className={styles.logoSpan}>AA </span> Anime Archive</div>
          <MdClose style={{ color: "white" }} onClick={closeMobile}/>
        </div>
          <ul className={styles.list}>
            {userId ? (
              <>
                {userMenuItems.map(category=>(
                  <li key={category.title}>
                      <span className={styles.category}>{category.title}</span>
                      {category.list.map(item=>(
                          <MenuLink item={item} key={item}/>
                      ))}
                  </li>
                ))}
              </>
            ) : (
              <>
                {menuItems.map(category=>(
                  <li key={category.title}>
                      <span className={styles.category}>{category.title}</span>
                      {category.list.map(item=>(
                          <MenuLink item={item} key={item}/>
                      ))}
                  </li>
                ))}
              </>
            )}
              {userId && <button onClick={attemptLogout} className={styles.logoutButton}>Logout</button>}
          </ul>
      </div>
    </>
  )
}

export default Sidebar