import React, { CSSProperties } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { Post } from './models/tables';
import { GetResponse } from './models/api';
import PostsTable from './components/PostsTable';

interface Props {
	style?: CSSProperties;
}
interface State {
	posts: Post[];
}
const DEFAULT_STATE: State = {
	posts: [],
};

const styles: {[component: string]: React.CSSProperties} = {
	container: {},
};
export default class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = DEFAULT_STATE;
	}

	componentDidMount(): void {
		axios.get<GetResponse<Post[]>>('https://rtd-rumours-server.herokuapp.com/posts')
			.then((result) => {
				if (result.data.isSuccessful) {
					const posts = result.data.data;
					this.setState({ posts });
				}
			});
	}

	render(): JSX.Element {
		const { style: additionalStyle } = this.props;
		return (
			<div className="App" style={{ ...styles.container, ...additionalStyle }}>
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
					<PostsTable posts={this.state.posts} />
				</header>
			</div>
		);
	}
}
