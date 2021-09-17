import React, { CSSProperties } from 'react';

interface Props<T> {
	getItemsData: (searchString: string) => T[];
	getItemKey: (itemData: T, index: number) => string | number;
	getElement: (itemData: T, isHovered: boolean, index: number) => JSX.Element;
	getTitle: (itemData: T, index: number) => string;
	onHover?: (itemData: T, index: number) => void;
	onSelect?: (itemdata: T, index: number) => void;
	style?: CSSProperties;
}
interface State<T> {
	searchString: string;
	itemsData: T[];
	hoverIndex?: number;
	isShown: boolean;
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
			isShown: false,
		};
		this.state = DEFAULT_STATE;
	}

	updateItems(searchString: string): void {
		const itemsData = this.props.getItemsData(searchString);
		this.setState({ searchString, itemsData });
	}

	render(): JSX.Element {
		const { style: additionalStyle } = this.props;
		const itemElements = this.state.itemsData.map((itemData, index) => (
			this.props.getElement(itemData, this.state.hoverIndex === index, index)
		));
		return (
			<div style={{ ...styles.container, ...additionalStyle }}>
				<input
					type="text"
					value={this.state.searchString}
					onChange={(e) => {
						const searchString = e.target.value;
						this.updateItems(searchString);
					}}
					onFocus={(e) => {
						const searchString = e.target.value;
						this.updateItems(searchString);
						this.setState({ isShown: true });
					}}
					onBlur={() => {
						setTimeout(() => {
							this.setState({ isShown: false });
						}, 300);
					}}
				/>
				<div
					className="search-dropdown-options-container"
					style={{
						display: this.state.isShown ? undefined : 'none',
						...styles.optionsContainer,
					}}
				>
					{itemElements.map((item, index) => {
						const itemData = this.state.itemsData[index];
						return (
							/* eslint-disable jsx-a11y/click-events-have-key-events */
							/* eslint-disable jsx-a11y/no-static-element-interactions */
							<div
								key={this.props.getItemKey(itemData, index)}
								onMouseEnter={() => {
									this.setState({ hoverIndex: index });
									if (this.props.onHover) this.props.onHover(itemData, index);
								}}
								onMouseLeave={() => { if (this.state.hoverIndex === index) this.setState({ hoverIndex: undefined }); }}
								onClick={() => {
									if (this.props.onSelect) this.props.onSelect(itemData, index);
									this.setState({ searchString: this.props.getTitle(itemData, index) });
								}}
							>
								{item}
							</div>
							/* eslint-enable jsx-a11y/click-events-have-key-events */
							/* eslint-enable jsx-a11y/no-static-element-interactions */
						);
					})}
				</div>
			</div>
		);
	}
}
