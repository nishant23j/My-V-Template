import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import bild_heart_3 from './pictures/heart.png';
import pic1 from './pictures/1.png';
import pic2 from './pictures/2.png';
import pic3 from './pictures/3.png';
import pic4 from './pictures/4.png';
import pic5 from './pictures/5.png';
import pic6 from './pictures/6.png';
import pic7 from './pictures/7.png';
import pic8 from './pictures/8.png';
import pic9 from './pictures/9.png';
import pic10 from './pictures/10.png';
import audio_hug from './audio/Audio.mp3';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [randomImages, setRandomImages] = useState([]);
    const [textIndex, setTextIndex] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const images = [bild_heart_3, pic1, pic2, pic3, pic4, pic5, pic6, pic7, pic8, pic9, pic10];
    const [audioStarted, setAudioStarted] = useState(false);
    const girlfriendName = "Bubu";
    const audioRef = useRef();

    const texts = [
        `${girlfriendName}, Thanks for being in my life!`,
        "I Love you to the moon and back :)",
        "You are my sunshine!",
        "You are my everything!",
        "You are my world!",
        "I wish I could be with you every single moment!",
        "I miss you so much!",
        "I can't wait to see you again!",
        "Happy Valentine's Day Love!",
        `${girlfriendName}, Will you be my Valentine?`
    ];

    const generateRandomPosition = () => {
        const rows = 5; // Number of rows
        const columns = 2; // Number of columns

        const areaWidth = window.innerWidth / columns;
        const areaHeight = window.innerHeight / rows;

        const randomX = Math.random() * areaWidth + Math.floor(Math.random() * columns) * areaWidth;
        const randomY = Math.random() * areaHeight + Math.floor(Math.random() * rows) * areaHeight;

        return { x: randomX, y: randomY };
    };

    const handleClick = () => {
        for (let i = 0; i < 5; i++) {
            const randomTimeout = Math.floor(Math.random() * 1001) + 1000; // Random display duration between 1 and 2 seconds
            setTimeout(() => {
                const newRandomImage = {
                    image: images[Math.floor(Math.random() * images.length)],
                    position: generateRandomPosition(),
                    timeout: randomTimeout
                };
                setRandomImages(prevImages => [...prevImages, newRandomImage]);
            }, i * 250); // Delay of 500ms between each image generation
        }
    };

    useEffect(() => {
        if (audioStarted) {
            handleClick();
            //handleLoadedMetadata();
            const intervalId = setInterval(handleClick, 3000);

            return () => clearInterval(intervalId);
        }
    }, [audioStarted]);

    useEffect(() => {
        const timeouts = randomImages.map(({ timeout }, index) => {
            return setTimeout(() => {
                setRandomImages(prevImages => {
                    const updatedImages = [...prevImages];
                    updatedImages.splice(index, 1);
                    return updatedImages;
                });
            }, timeout);
        });

        return () => timeouts.forEach(clearTimeout);
    }, [randomImages]);

    const handleAudioPlay = () => {
        if (!audioStarted) {
            audioRef.current.play();
            setAudioStarted(true);
        }
    };

    useEffect(() => {
        const handleClickAnywhere = () => {
            handleAudioPlay();
        };

        document.addEventListener('click', handleClickAnywhere);

        return () => {
            document.removeEventListener('click', handleClickAnywhere);
        };
    }, []);

    useEffect(() => {
        if (audioStarted) {
            const intervalId = setInterval(() => {
                if (textIndex < texts.length - 1) {
                    setFadeOut(true);
                    setTimeout(() => {
                        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
                        setFadeOut(false);
                    }, 1000); // Duration of the fade-out effect
                } 
            }, 5000); // Change text every 5 seconds

            return () => clearInterval(intervalId);
        }
    }, [audioStarted, textIndex]);

    return (
        <div className="background-image" onClick={handleAudioPlay}>
            <div className="container-fluid">
                {audioStarted && <div className="align-content-center">
                    <div className="col text-center">
                        <h1 className={`my-text ${fadeOut && textIndex < texts.length - 1 ? 'fade-out' : ''}`}>{texts[textIndex]}</h1>
                    </div>
                </div>}
                {!audioStarted && <div className="align-content-center">
                    <div className="col text-center">
                        <h1 className="my-text">just touch the screen and turn on sound :)</h1>
                    </div>
                </div>}
                <div className="row">
                    <div className="audio-container">
                        <audio
                            ref={audioRef}
                            src={audio_hug}
                            autoPlay
                            className="w-100"
                        >
                            Your browser does not support the
                            <code>audio</code> element.
                        </audio>
                    </div>
                </div>

                {randomImages.map((randomImage, index) => (
                    <img
                        key={index}
                        src={randomImage.image}
                        className={`fluid-img ${fadeOut ? 'fade-out' : ''}`}
                        style={{
                            position: 'absolute',
                            left: Math.min(randomImage.position.x, window.innerWidth - 200),
                            top: Math.min(randomImage.position.y, window.innerHeight - 200),
                            width: '25%',
                            height: 'auto'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default App;