import React from 'react';
import PropTypes from 'prop-types';

import { ApiUrlConsumer } from '../contexts/ApiUrlContext';

import { MediaMultiListWrapper } from './components/MediaMultiListWrapper';
import { MediaListRow } from './components/MediaListRow';

import { LazyLoadItemListAsync } from '../components/-NEW-/LazyLoadItemListAsync';

import { Page } from './_Page';
import PageStore from './_PageStore';
import { config as mediacmsConfig } from '../mediacms/config.js'

export class HomeSingleFeaturedPage extends Page {

	constructor( props ){

		super( props, 'home' );

		this.mediacms_config = mediacmsConfig( window.MediaCMS );

		this.state = {
			loadedLatest: false,
			visibleLatest: false,
			loadedFeatured: false,
			visibleFeatured: false,
			loadedRecommended: false,
			visibleRecommended: false,
			indexFeaturedList: []
		};

		this.onLoadLatest = this.onLoadLatest.bind(this);
		this.onLoadFeatured = this.onLoadFeatured.bind(this);
		this.onLoadRecommended = this.onLoadRecommended.bind(this);
	}

	componentDidMount() {
		fetch(this.mediacms_config.api.indexfeatured)
		.then((response) => response.json())
		.then(indexFeaturedListData => {
			this.setState({ indexFeaturedList: indexFeaturedListData });
		});
	}

	onLoadLatest( length ){
		this.setState({ loadedLatest: true, visibleLatest: 0 < length });
	}

	onLoadFeatured( length ){
		this.setState({ loadedFeatured: true, visibleFeatured: 0 < length });
	}

	onLoadRecommended( length ){
		this.setState({ loadedRecommended: true, visibleRecommended: 0 < length });
	}



	pageContent(){


		return <ApiUrlConsumer>
				{ apiUrl =>
				<>
					<MediaMultiListWrapper className="items-list-ver">

						{ this.state.loadedLatest && ! this.state.visibleLatest ? null :
							<MediaListRow className={ "feat-first-item" + ( void 0 === this.props.title ? " no-title" : "" ) }>

								<LazyLoadItemListAsync
									headingText="Featured videos"
									firstItemViewer={ true }
									firstItemDescr={ true }
									firstItemRequestUrl={ apiUrl.featured}
									requestUrl={ apiUrl.featured }
									itemsCountCallback={ this.onLoadLatest }
									hideViews={true}
									hideAuthor={ ! PageStore.get('config-media-item').displayAuthor }
									hideDate={ ! PageStore.get('config-media-item').displayPublishDate }
									forceDisableInfiniteScroll={true}
									pageItems={ 9999 }
									maxItems={ 8 }
									/>

							</MediaListRow> }
					</MediaMultiListWrapper>

					{this.state.indexFeaturedList.map((item, index) => (
							<MediaMultiListWrapper key={index} className={ "items-list-ver " + (index % 2 === 0 ? 'hw-even-list' : 'hw-odd-list')}>
								{ this.state.loadedLatest && ! this.state.visibleLatest ? null :
									<MediaListRow title={item.title} viewAllLink={ item.url } viewAllText={'View all'} desc={item.text}  className={ ( void 0 === this.props.title ? " no-title" : "" ) }>
										<LazyLoadItemListAsync
											requestUrl={ item.api_url }
											hideViews={true}
											hideAuthor={ ! PageStore.get('config-media-item').displayAuthor }
											hideDate={ ! PageStore.get('config-media-item').displayPublishDate }
											forceDisableInfiniteScroll={true}
											maxItems={ 8 }
											/>
									</MediaListRow> }
							</MediaMultiListWrapper>
					))}

					{/*More recent videos*/}
					<MediaMultiListWrapper className="items-list-ver">

						{ this.state.loadedLatest && ! this.state.visibleLatest ? null :
							<MediaListRow className={ "feat-first-item hw-most-recent-videos" + ( void 0 === this.props.title ? " no-title" : "" ) }>

								<LazyLoadItemListAsync
									headingText="Recent videos"
									firstItemViewer={ true }
									firstItemDescr={ true }
									requestUrl={ apiUrl.media }
									itemsCountCallback={ this.onLoadLatest }
									hideViews={true}
									hideAuthor={ ! PageStore.get('config-media-item').displayAuthor }
									hideDate={ ! PageStore.get('config-media-item').displayPublishDate }
									pageItems={ 20 }
								/>

							</MediaListRow> }
					</MediaMultiListWrapper>


				</>
				}
				</ApiUrlConsumer>;
	}
}

HomeSingleFeaturedPage.propTypes = {
	title: PropTypes.string,
};
