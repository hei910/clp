import React, { useState, useEffect } from 'react';
import webSocket from 'socket.io-client'

interface IProps {
}

const Test: React.FC<IProps> = (props) => {

    const [ws, setWs] = useState(null)
    const [counts, setCount] = useState({orange: 0, blue: 0});
    
    useEffect(() => {
        connectWebSocket();
    },[])

    useEffect(()=>{
        if (ws) {
            initWebSocket()
        }
    },[ws])


    const connectWebSocket = () => {
        setWs(webSocket('http://localhost:1080'))
        console.log('success connect WebSocket!')
    }

    const initWebSocket = () => {
        ws.on('getMessage', message => {
            console.log(message)
        })
    }

    const sendMessage = (e: MouseEvent) => {
        ws.emit('getMessage', '只回傳給發送訊息的 client')
        const type = e.currentTarget.value;
        setCount(counts => ({...counts, [type]: counts[type] + 1}));
    }

    return (
        <>
            <div>Add: {counts.orange} </div>
            <div>Deduct: {counts.blue} </div>
            <button onClick={ sendMessage } value="orange">Add</button>
            <button onClick={ sendMessage } value="blue">Deduct</button>
        </>
    )
}

export default Test;