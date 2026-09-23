import React from 'react'

export default function Gallery({ photos = [] }) {
  if (!photos.length) {
    return <p>Aucune photo disponible.</p>
  }

  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'20px'}}>
      {photos.map(photo => (
        <div key={photo.id}>
          <img
            src={photo.image_url}
            alt={photo.title}
            style={{width:'100%',height:'250px',objectFit:'cover'}}
          />
          <h3>{photo.title}</h3>
          <p>{photo.description}</p>
          <small>{photo.camera} {photo.lens}</small>
        </div>
      ))}
    </div>
  )
}
