import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
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

const socket = io('http://localhost:1080');
let socketOn = false;
let counts:Counts = { orange: 0, blue: 0};
let t = 0;
let timer: any;

const Dashboard: React.FC<IProps> = (props) => {
    const [data, setData] = useState<Counts[]>([{ name: 0, orange: 0, blue: 0, black: 0 }]);
    const [state, setState] = useState<State>(null);
    const initData:Counts[] = [];

    // Gen initial chart data
    for (var i=0; i <= 5; i = i+0.5) {
        initData.push({ name: i, orange: 0, blue: 0, black: 0 })
    }    

    useEffect(()=>{
        console.log("state: ", state)
		initSocket()
    },[])
    
    useEffect(() => {
        if (state === "started") runTimer();
        if (state === "finished") abc();
    },[state])

    const abc = () => {
        console.log(123, state)
    }

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
        }, 100)
    }

    const initSocket = () => {
        socket.on('getCounts', (message: keyof Counts) => {
            counts[message]++;
            if (!state && !socketOn) {
                setState("started");
                socketOn = true
            }
        })
    }

    const getTotalCounts = (type: "orange" | "blue") => {
        let total = 0;
        data.forEach(item => total = total + item[type])
        return total;
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
                Please go to <a href={window.location.origin + "/client"}>{window.location.origin + "/client"}</a> to join the game.
            </p>
		</div>
	);
}

export default Dashboard;