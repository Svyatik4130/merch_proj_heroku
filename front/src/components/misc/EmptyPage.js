import React from 'react'

export default function EmptyPage({ text }) {
    return (
        <div className="emptypage-container">
            <img src={"/uploads/empty.png"} alt="empty" className="emptypage-container-img"/>
            <p className="emptypage-container-text">{text}</p>
        </div>
    )
}
