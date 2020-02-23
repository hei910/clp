import React, { useEffect, MouseEvent } from 'react';
import io from 'socket.io-client';

interface IProps {
}
let socket: any;

const Client: React.FC<IProps> = (props) => {
	
    useEffect(()=>{
		socket = io('http://localhost:1080');
		getCountsFromSocket()
	},[])
	
    const getCountsFromSocket = () => {
        socket.on('getCounts', (message:string) => {
            console.log(message)
		})
	}
	
	const handleClick = (e : MouseEvent<HTMLButtonElement>) => {
		const type = e.currentTarget.value;
		socket.emit('getCounts', type)
	}
	return (
		<div className="page-client">
			<div className="btns">
				<button onClick={ handleClick } value="orange" className="bg-orange">-</button>
				<button onClick={ handleClick } value="blue" className="bg-blue">+</button>
			</div>
		</div>
	);
}

export default Client;