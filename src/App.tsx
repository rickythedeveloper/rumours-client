import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

function App(): JSX.Element {
	const [apiTestResult, setAPITestResult] = useState<{testJson: string}>({ testJson: 'not fetched yet' });

	useEffect(() => {
		axios.get<{testJson: string}>('https://rtd-rumours-server.herokuapp.com/apitest')
			.then((result) => {
				setAPITestResult(result.data);
			});
	});

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit
					{' '}
					<code>src/App.tsx</code>
					{' '}
					and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<p>
					API Test result:
					{' '}
					{apiTestResult.testJson}
				</p>
			</header>
		</div>
	);
}

export default App;
