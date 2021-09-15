import React, { CSSProperties } from 'react';
import { Channel } from '../models/tables';

interface Props {
	channels: Channel[];
	setChannel: (channelID: number) => void;
	style?: CSSProperties;
}
interface State {}
const DEFAULT_STATE: State = {};

const styles: {[component: string]: React.CSSProperties} = {
	container: {},
};

const getChannelID = (channels: Channel[], channelName: string): number | null => {
	for (let i = 0; i < channels.length; i++) {
		if (channels[i].name === channelName) return channels[i].id;
	}
	return null;
};

export default class ChannelDropdown extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = DEFAULT_STATE;
	}

	render(): JSX.Element {
		const channelElements = this.props.channels.map((channel) => <option key={channel.id} value={channel.name}>{channel.name}</option>);

		return (
			<div style={{ ...styles.container, ...this.props.style }}>
				<input
					list="channel"
					ref={(el) => {
						if (el === null) return;
						el.addEventListener('change', () => {
							const channelName = el.value;
							const channelID = getChannelID(this.props.channels, channelName);
							if (channelID !== null) this.props.setChannel(channelID);
						});
					}}
				/>
				<datalist id="channel">
					{channelElements}
				</datalist>
			</div>
		);
	}
}
