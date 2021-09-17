import React, { CSSProperties } from 'react';

interface Props<T> {
	getItemsData: (searchString: string) => T[];
	getItemKey: (itemData: T, index: number) => string | number;
	getElement: (itemData: T, index: number) => JSX.Element;
	hoverHighlightColor?: string;
	style?: CSSProperties;
}
interface State<T> {
	searchString: string;
	itemsData: T[];
	items: JSX.Element[];
	hoverIndex?: number;
}

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
export default class SearchDropdown<T> extends React.Component<Props<T>, State<T>> {
	constructor(props: Props<T>) {
		super(props);

		const DEFAULT_STATE: State<T> = {
			searchString: '',
			itemsData: [],
			items: [],
		};
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
						const items = itemsData.map((itemData, index) => this.props.getElement(itemData, index));
						this.setState({ searchString, items });
					}}
				/>
				<div className="search-dropdown-options-container" style={styles.optionsContainer}>
					{this.state.items.map((item, index) => (
						<div
							key={this.props.getItemKey(this.state.itemsData[index], index)}
							style={{
								backgroundColor: this.state.hoverIndex === index ? this.props.hoverHighlightColor || 'red' : undefined,
							}}
							onMouseEnter={() => { this.setState({ hoverIndex: index }); }}
							onMouseLeave={() => { if (this.state.hoverIndex === index) this.setState({ hoverIndex: undefined }); }}
						>
							{item}
						</div>
					))}
				</div>
			</div>
		);
	}
}
