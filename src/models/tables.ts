/* eslint-disable camelcase */
export interface Channel {
	id: number;
	name: string;
}

export interface Post {
	id: number;
	time: string;
	text: string;
	channel_id: number;
}
/* eslint-enable camelcase */
