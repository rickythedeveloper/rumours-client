import React, { CSSProperties } from 'react';
import axios from 'axios';
import './App.css';
import { Post, Channel } from './models/tables';
import { GetResponse, PostResponse } from './models/api';
import PostsTable from './components/PostsTable';
import ChannelDropdown from './components/ChannelDropdown';
import { SERVER_URL } from './constants';
import SearchDropdown from './components/generic/SearchDropdown.tsx';

interface Props {
	style?: CSSProperties;
}
interface State {
	posts: Post[];
	channels: Channel[];
	selectedChannelID?: number;
	hoveredChannelID?: number;
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

const submitRumour = async (
	text: string,
	channelID: number,
	onSuccess: (newPost: Post) => void,
	onFailure: (error: unknown) => void,
): Promise<void> => {
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

const getPostCountInChannel = (channelID: number, posts: Post[]): number => {
	let count = 0;
	posts.forEach((post) => {
		if (post.channel_id === channelID) count += 1;
	});
	return count;
};

const getChannelsOnSearch = (
	searchString: string,
	channels: Channel[],
	posts: Post[],
): Channel[] => {
	const searchWords = searchString.split(' ');
	const matchedChannels = channels.filter((channel) => {
		for (let i = 0; i < searchWords.length; i++) {
			const searchWord = searchWords[i];
			if (channel.name.toLowerCase().includes(searchWord.toLowerCase())) return true;
		}
		return false;
	});

	matchedChannels.sort((a, b) => getPostCountInChannel(b.id, posts) - getPostCountInChannel(a.id, posts));
	return matchedChannels;
};

const channelCellElement = (channel: Channel, isHovered: boolean): JSX.Element => (
	<div style={{
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: isHovered ? '#666' : '#333',
	}}
	>
		<div>{channel.name}</div>
		<div style={{ color: '#aaa' }}>
			#
			{channel.id}
		</div>
	</div>
);

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
		const shownChannelID = this.state.hoveredChannelID || this.state.selectedChannelID;
		const shownPosts = this.state.posts.filter((post) => post.channel_id === shownChannelID);

		return (
			<div className="App" style={{ ...styles.container, ...this.props.style }}>

				<h1>rumours</h1>
				<PostsTable posts={shownPosts} />

				<div style={styles.postDraftSection}>
					<SearchDropdown<Channel>
						getItemsData={(search) => getChannelsOnSearch(search, this.state.channels, this.state.posts)}
						getItemKey={(channel) => channel.id}
						getElement={(channel, isHovered) => channelCellElement(channel, isHovered)}
						getTitle={(channel) => channel.name}
						onSelect={(channel) => { this.setState({ selectedChannelID: channel.id }); }}
						onHover={(channel) => { this.setState({ hoveredChannelID: channel.id }); }}
					/>
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
							if (shownChannelID === undefined) return;
							await submitRumour(this.state.draftText, shownChannelID,
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
