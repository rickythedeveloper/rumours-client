import React, { CSSProperties } from 'react';
import { Post } from '../models/tables';

interface Props {
	posts: Post[];
	style?: CSSProperties;
}
interface State {}
const DEFAULT_STATE: State = {};

const styles: {[component: string]: React.CSSProperties} = {
	container: {},
};
export default class PostsTable extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = DEFAULT_STATE;
	}

	render(): JSX.Element {
		const { style: additionalStyle } = this.props;
		return (
			<div style={{ ...styles.container, ...additionalStyle }}>
				{this.props.posts.map((post) => <div>{post.text}</div>)}
			</div>
		);
	}
}
