import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import QRCode from 'qrcode.react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface IProps {
}
interface Counts {
    name?: number;
    orange: number;
    blue: number;
    black?: number;
}
type State = 'started' | 'finished' | null;

let counts:Counts = { orange: 0, blue: 0};
let t = 0;
let timer: any;
let socket: any;

const client_page_url = window.location.origin + "/client"

const Dashboard: React.FC<IProps> = (props) => {
    const [data, setData] = useState<Counts[]>([{ name: 0, orange: 0, blue: 0, black: 0 }]);
    const [state, setState] = useState<State>(null);
    const initData:Counts[] = [];

    // Gen initial chart data
    for (var i=0; i <= 5; i = i+0.5) {
        initData.push({ name: i, orange: 0, blue: 0, black: 0 })
    }    

    useEffect(()=>{
        socket = io('http://localhost:1080');
		getCountsFromSocket()
    },[])
    
    useEffect(() => {
        if (state === "started") runTimer();
    },[state])

    const runTimer = () => {
        timer = setInterval( () => {
            const { orange, blue } = counts;
            if (t < 5) {
                t = t + 0.5;
                setData( data => {
                    return [...data, {
                        name: t,
                        orange,
                        blue,
                        black: blue - orange
                    }]
                })
                counts = { orange: 0, blue: 0 };
                console.log("Time: " + t.toFixed(1) + " Counts: " + orange + " | " + blue)
            } else if (t >= 5) {
                setState("finished")
                clearInterval(timer)
            }
        }, 500)
    }

    const getCountsFromSocket = () => {
        socket.on('getCounts', (message: keyof Counts) => {
            counts[message]++;
            if (!state && !t) setState("started");
        })
    }

    const getTotalCounts = (type: "orange" | "blue") => {
        return data.reduce( (acc, cur) => acc + cur[type], 0 )
    }

	return (
		<div className="page-dashboard">
            <LineChart width={800} height={400} data={ state === "finished" ? data : initData }>
                <XAxis dataKey="name" label={{ value: 'Second(s)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Click(s)', angle: -90 , position: 'insideLeft', offset: -5 }} />
                <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="orange" stroke="#ff9559" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="blue" stroke="#007bff" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="black" stroke="#000000" dot={false} strokeWidth={4} />
                <Tooltip />
            </LineChart>

            <div className="counts">
                <div className="box bg-orange">{ getTotalCounts("orange") }</div>
                <div className="box bg-blue">{ getTotalCounts("blue") }</div>
            </div>
            <p>
                Please go to <a href={client_page_url}>{client_page_url}</a> to join the game.
            </p>
            <p>
                <QRCode value={client_page_url} size={172} />
            </p>
		</div>
	);
}

export default Dashboard;