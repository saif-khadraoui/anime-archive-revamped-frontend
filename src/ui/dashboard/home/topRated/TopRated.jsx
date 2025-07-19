import React, { useState, useEffect, useRef } from 'react'
import styles from "./topRated.module.css"
import Axios from "axios"
import { motion } from 'framer-motion'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useNavigate } from 'react-router-dom';

function TopRated() {
    const responsive = {
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024
          },
          items: 3,
          partialVisibilityGutter: 40
        },
        mobile: {
          breakpoint: {
            max: 300,
            min: 0
          },
          items: 1,
          partialVisibilityGutter: 30
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464
          },
          items: 2,
          partialVisibilityGutter: 30
        }
      }
    const [animes, setAnimes] = useState([])
    const [width, setWidth] = useState(0)
    const carousel = useRef()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAnimes = async () => {
            await Axios.get("https://api.jikan.moe/v4/top/anime").then((response) => {
                console.log(response)
                setAnimes(response.data.data.slice(0, 20))
            })
        }
        fetchAnimes()

    }, [])

    useEffect(() => {
        if(carousel.current){
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
        }
    }, [])

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h3>Top Rated Animes</h3>
        </div>
        <div className={styles.carouselContainer}>
            <Carousel
                additionalTransfrom={0}
                arrows
                autoPlaySpeed={3000}
                centerMode={false}
                className={styles.inner}
                containerClass={styles.innerContainer}
                dotListClass=""
                draggable
                focusOnSelect={false}
                infinite={true}
                itemClass={styles.itemClass}
                keyBoardControl
                minimumTouchDrag={80}
                partialVisible={false}
                pauseOnHover
                renderArrowsWhenDisabled={false}
                renderButtonGroupOutside={false}
                renderDotsOutside={false}
                responsive={responsive}
                rewind={false}
                rewindWithAnimation={false}
                rtl={false}
                shouldResetAutoplay
                showDots={false}
                sliderClass={styles.sliderClass}
                slidesToSlide={1}
                swipeable
              >
                 {animes.map((item, idx) => {
                        return(
                            <div className={styles.item} key={idx} onClick={(() => {
                                navigate(`/dashboard/anime/${item.mal_id}`)
                            })}>
                                <img src={item.images.jpg.image_url} alt=""/>
                                <p className={styles.anime_title}>{item.title}</p>
                            </div>
                        );
                    })}
            </Carousel>;
        </div>
    </div>
  )
}

export default TopRated