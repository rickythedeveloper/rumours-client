import React, { CSSProperties } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import { Post, Channel } from './models/tables';
import { GetResponse } from './models/api';
import PostsTable from './components/PostsTable';
import ChannelDropdown from './components/ChannelDropdown';

interface Props {
	style?: CSSProperties;
}
interface State {
	posts: Post[];
	channels: Channel[];
	selectedPostID?: number;
}
const DEFAULT_STATE: State = {
	posts: [],
	channels: [],
};

const styles: {[component: string]: React.CSSProperties} = {
	container: {
		backgroundColor: '#282c34',
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		color: 'white',
	},
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
			})
			.catch((error) => { throw error; });
		axios.get<GetResponse<Channel[]>>('https://rtd-rumours-server.herokuapp.com/channels')
			.then((result) => {
				if (result.data.isSuccessful) {
					const channels = result.data.data;
					this.setState({ channels });
				}
			})
			.catch((error) => { throw error; });
	}

	render(): JSX.Element {
		const shownPosts = this.state.posts.filter((post) => post.channel_id === this.state.selectedPostID);

		return (
			<div className="App" style={{ ...styles.container, ...this.props.style }}>
				<h1>rumours</h1>
				<ChannelDropdown channels={this.state.channels} setChannel={(id) => { this.setState({ selectedPostID: id }); }} />
				<PostsTable posts={shownPosts} />
			</div>
		);
	}
}
