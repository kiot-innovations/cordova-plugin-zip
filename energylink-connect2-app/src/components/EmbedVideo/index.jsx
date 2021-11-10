import React from 'react'

const EmbedVideo = ({ title, embedId, ...props }) => (
  <div className="video-responsive">
    <iframe
      width="853"
      height="480"
      src={`https://player.vimeo.com/video/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
      {...props}
    />
  </div>
)

export default EmbedVideo
