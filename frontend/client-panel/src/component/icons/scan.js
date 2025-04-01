import React from 'react'

const ScanQr = ({width=24,height=24,className="",color="currentColor"}) => {
  return (
    <svg
    width={width}
    height={height}
    className={className}
    fill={color} xmlns="http://www.w3.org/2000/svg"><path d="M4 4h5V2H2v7h2V4zM4 15H2v7h7v-2H4v-5zM15 2v2h5v5h2V2h-7zM20 20h-5v2h7v-7h-2v5z"/><path d="M6 11h5V6H6zm2-3h1v1H8zM18 6h-5v5h5zm-2 3h-1V8h1zM18 13h-5v5h5zm-2 3h-1v-1h1zM6 18h5v-5H6zm2-3h1v1H8z"/></svg>


  )
}

export default ScanQr