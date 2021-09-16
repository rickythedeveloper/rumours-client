import React, { CSSProperties, FormEventHandler } from 'react';
import axios from 'axios';
import './App.css';
import { Post, Channel } from './models/tables';
import { GetResponse, PostResponse } from './models/api';
import PostsTable from './components/PostsTable';
import ChannelDropdown from './components/ChannelDropdown';
import { SERVER_URL } from './constants';

interface Props {
	style?: CSSProperties;
}
interface State {
	posts: Post[];
	channels: Channel[];
	selectedChannelID?: number;
	draftText: string;
}
const DEFAULT_STATE: State = {
	posts: [],
	channels: [],
	draftText: '',
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
	postDraftSection: {
		display: 'flex',
		flexDirection: 'row',
	},
	draftTextbox: {
		flex: '1 1 auto',
	},
	sendButton: {
		flex: '0 0 50px',
	},
};

const submitRumour = async (text: string, channelID: number, onSuccess: (newPost: Post) => void, onFailure: (error: unknown) => void): Promise<void> => {
	const requestBody = { text, channel_id: channelID };
	await axios.post<PostResponse<Post>>(`${SERVER_URL}/posts`, requestBody)
		.then((newPost) => {
			if (newPost.data.isSuccessful) {
				onSuccess(newPost.data.data);
			} else {
				onFailure(newPost.data.error);
			}
		})
		.catch(onFailure);
};

const getPosts = async (): Promise<Post[]> => {
	const result = await axios.get<GetResponse<Post[]>>(`${SERVER_URL}/posts`);
	if (result.data.isSuccessful) {
		const posts = result.data.data;
		return posts;
	}
	throw new Error(result.data.error);
};

const getChannels = async (): Promise<Channel[]> => {
	const result = await axios.get<GetResponse<Channel[]>>(`${SERVER_URL}/channels`);
	if (result.data.isSuccessful) {
		const posts = result.data.data;
		return posts;
	}
	throw new Error(result.data.error);
};

export default class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = DEFAULT_STATE;
	}

	componentDidMount(): void {
		getPosts()
			.then((posts) => this.setState({ posts }))
			.catch((error) => { console.log(error); });
		getChannels()
			.then((channels) => this.setState({ channels }))
			.catch((error) => { console.log(error); });
	}

	render(): JSX.Element {
		const shownPosts = this.state.posts.filter((post) => post.channel_id === this.state.selectedChannelID);

		return (
			<div className="App" style={{ ...styles.container, ...this.props.style }}>
				<h1>rumours</h1>
				<ChannelDropdown channels={this.state.channels} setChannel={(id) => { this.setState({ selectedChannelID: id }); }} />
				<PostsTable posts={shownPosts} />

				<div style={styles.postDraftSection}>
					<input
						type="text"
						style={styles.draftTextbox}
						value={this.state.draftText}
						onChange={(e) => this.setState({ draftText: e.target.value })}
					/>
					<button
						type="button"
						style={styles.sendButton}
						onClick={async () => {
							if (this.state.selectedChannelID === undefined) return;
							await submitRumour(this.state.draftText, this.state.selectedChannelID,
								async () => {
									this.setState({ draftText: '' });

									getPosts()
										.then((posts) => this.setState({ posts }))
										.catch((error) => { console.log(error); });
								}, (error) => {
									console.log(error);
								});
						}}
					>
						Send
					</button>
				</div>
			</div>
		);
	}
}
