import { useState, useEffect } from "react";
import rs from "../Media/rs.jpg";

function Carousel() {

    const slides = [
        {
            name: "Rohit Sharma",
            img: rs
        },
        {
            name: "Virat Kohli",
            img: "https://wallpapercave.com/wp/wp4056410.jpg"
        },
        {
            name: "Sachin Tendulkar",
            img: "https://wallpapercave.com/wp/wp4056406.jpg"
        }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const goToPrevious = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setIndex((prev) => (prev + 1) % slides.length);
    };

    return (
        <div style={{ position: "relative", marginTop: "80px" }}>

            <img
                src={slides[index].img}
                alt="player"
                style={{
                    width: "100%",
                    height: "450px",
                    objectFit: "cover"
                }}
            />

            {/* Previous Button */}
            <button
                onClick={goToPrevious}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "20px",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    padding: "15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "20px"
                }}
            >
                ❮
            </button>

            {/* Next Button */}
            <button
                onClick={goToNext}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "20px",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    padding: "15px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    fontSize: "20px"
                }}
            >
                ❯
            </button>

            {/* Player Name Overlay */}

            <div
                style={{
                    position: "absolute",
                    bottom: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "white",
                    fontSize: "40px",
                    fontWeight: "bold",
                    background: "rgba(0,0,0,0.5)",
                    padding: "10px 25px",
                    borderRadius: "10px"
                }}
            >
                {slides[index].name}
            </div>

            {/* Dots Indicator */}
            <div
                style={{
                    position: "absolute",
                    bottom: "15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "10px"
                }}
            >
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            border: "none",
                            background: i === index ? "#facc15" : "rgba(255,255,255,0.5)",
                            cursor: "pointer"
                        }}
                    />
                ))}
            </div>

        </div>
    );
}

export default Carousel;
