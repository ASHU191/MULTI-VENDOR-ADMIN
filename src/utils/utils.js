import io from 'socket.io-client'
const backendUrl = process.env.SERVER_URL
export const overrideStyle = {
    display: 'flex',
    margin: '0 auto',
    height: '24px',
    justifyContent: 'center',
    alignItems: "center"
}

export const socket = io(`https://spiffy-fortune-porcupine.glitch.me`)