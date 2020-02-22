import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client'
import Client from './components/pages/client';
import Dashboard from './components/pages/dashboard';
import './App.css';

interface IProps {
}
const socket = io("http://localhost:1080");

const App: React.FC<IProps> = (props) => {
	
	return (
			<BrowserRouter>
				<Switch>
					<Route path="/client" component={Client} />
					<Route path="/" component={Dashboard} />
				</Switch>
			</BrowserRouter>
	);
}

export default App;
