import React, { useState } from 'react'

const UserClassification = () => {
    const [playlistCount, setPlaylistCount] = useState(2)
    const [genres, setGenres] = useState(["Pop", "Rock", "Jazz"])
    const [circleGenres, setCircleGenres] = useState(() => Array(2).fill([]))

    const handleAddPlaylist = () => {
        if (playlistCount < 10) {
            setPlaylistCount(playlistCount + 1)
            setCircleGenres(prev => [...prev, []])
        }
    }

    const handleRemovePlaylist = () => {
        if (playlistCount > 1) {
            setPlaylistCount(playlistCount - 1)
            setCircleGenres(prev => {
                const newArr = [...prev]
                const removedCircleGenres = newArr.pop() 
                setGenres(top => [...top, ...removedCircleGenres])
                return newArr
            })
        }
    }

    const handleDragStart = (e, genre, circleIndex = null) => {
        e.dataTransfer.setData("genre", genre)
        if (circleIndex !== null) {
            e.dataTransfer.setData("circleIndex", circleIndex)
        }
    }

    const handleDropCircle = (e, targetIndex) => {
        e.preventDefault()
        const draggedGenre = e.dataTransfer.getData("genre")
        const sourceCircleIndex = e.dataTransfer.getData("circleIndex")

        if (sourceCircleIndex) {
            setCircleGenres(prev => {
                const newArr = [...prev]
                newArr[sourceCircleIndex] = newArr[sourceCircleIndex].filter(g => g !== draggedGenre)
                return newArr
            })
        } else {
            setGenres(prev => prev.filter(g => g !== draggedGenre))
        }

        setCircleGenres(prev => {
            const newArr = [...prev]
            newArr[targetIndex] = [...newArr[targetIndex], draggedGenre]
            return newArr
        })
    }

    const handleDropTop = (e) => {
        e.preventDefault()
        const draggedGenre = e.dataTransfer.getData("genre")
        const sourceCircleIndex = e.dataTransfer.getData("circleIndex")

        if (sourceCircleIndex) {
            setCircleGenres(prev => {
                const newArr = [...prev]
                newArr[sourceCircleIndex] = newArr[sourceCircleIndex].filter(g => g !== draggedGenre)
                return newArr
            })
            setGenres(prev => [...prev, draggedGenre])
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div
                style={{ border: "1px solid gray", padding: "1rem", marginBottom: "1rem" }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropTop}
            >
                <h3>Drag these genres into playlist circles (or back here):</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                    {genres.map((genre) => (
                        <div
                            key={genre}
                            draggable
                            onDragStart={(e) => handleDragStart(e, genre)}
                            style={{
                                padding: "0.5rem",
                                border: "1px dashed blue",
                                cursor: "grab"
                            }}
                        >
                            {genre}
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={handleRemovePlaylist}>- Playlist</button>
                <button onClick={handleAddPlaylist}>+ Playlist</button>
                <span>Current Playlists: {playlistCount}</span>
                <button onClick={() => console.log("Classify playlists!")}>Classify</button>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
                {Array.from({ length: playlistCount }, (_, index) => (
                    <div
                        key={index}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropCircle(e, index)}
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            border: "2px solid green",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        {circleGenres[index].map((genre, i) => (
                            <div
                                key={i}
                                draggable
                                onDragStart={(e) => handleDragStart(e, genre, index)}
                                style={{ fontSize: "0.8rem", cursor: "grab" }}
                            >
                                {genre}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserClassification