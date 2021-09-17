import React, { CSSProperties } from 'react';

interface Props<T> {
	getItemsData: (searchString: string) => T[];
	getItemKey: (itemData: T) => string | number;
	getElement: (itemData: T) => JSX.Element;
	style?: CSSProperties;
}
interface State {
	searchString: string;
	items: JSX.Element[];
	hoverIndex?: number;
}
const DEFAULT_STATE: State = {
	searchString: '',
	items: [],
};

const styles: {[component: string]: React.CSSProperties} = {
	container: {
		position: 'relative',
	},
	optionsContainer: {
		position: 'absolute',
		backgroundColor: 'black',
		width: '100%',
	},
};
export default class SearchDropdown<T> extends React.Component<Props<T>, State> {
	constructor(props: Props<T>) {
		super(props);
		this.state = DEFAULT_STATE;
	}

	render(): JSX.Element {
		const { style: additionalStyle } = this.props;
		return (
			<div style={{ ...styles.container, ...additionalStyle }}>
				<input
					type="text"
					value={this.state.searchString}
					onChange={(e) => {
						const searchString = e.target.value;
						const itemsData = this.props.getItemsData(searchString);
						const items = itemsData.map((itemData) => (
							<div
								key={this.props.getItemKey(itemData)}
							>
								{this.props.getElement(itemData)}
							</div>
						));
						this.setState({ searchString, items });
					}}
				/>
				<div className="search-dropdown-options-container" style={styles.optionsContainer}>
					{this.state.items}
				</div>
			</div>
		);
	}
}
