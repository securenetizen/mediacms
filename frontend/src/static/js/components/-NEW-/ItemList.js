import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useItemListSync } from './hooks/useItemListSync';

import PageStore from '../../pages/_PageStore.js';

import { PendingItemsList } from './PendingItemsList';
import { ListItem, listItemProps } from './ListItem';

import { ItemsStaticListHandler } from "./includes/itemLists/ItemsStaticListHandler";

import { PositiveIntegerOrZero } from '../../functions/propTypeFilters';

export function ItemList(props){

    const [ countedItems, items, listHandler, setListHandler, classname, itemsListWrapperRef, itemsListRef, onItemsCount, onItemsLoad, renderBeforeListWrap, renderAfterListWrap ] = useItemListSync(props);

    useEffect(() => {

        setListHandler( new ItemsStaticListHandler(props.items, props.pageItems, props.maxItems, onItemsCount, onItemsLoad) );

        return () => {
            if( listHandler ){
                listHandler.cancelAll();
                setListHandler(null);
            }
        };
    }, []);
    return ( ! countedItems ?
            <PendingItemsList className={ classname.listOuter } /> :
            ( ! items.length ? null : <div className={ classname.listOuter }>

                { renderBeforeListWrap() }

                <div ref={ itemsListWrapperRef } className="items-list-wrap">
                    <div ref={ itemsListRef } className={ classname.list }>
                    { items.map( ( itm, index ) => <ListItem key={ index } { ...listItemProps( props, itm, index ) } /> ) }
                    </div>
                </div>

                { renderAfterListWrap() }

            </div> )
           );
}

ItemList.propTypes = {
    items: PropTypes.array.isRequired,
    className: PropTypes.string,
    hideCategories: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideViews: PropTypes.bool,
    hideAuthor: PropTypes.bool,
    hidePlaylistOptions: PropTypes.bool,
    hidePlaylistOrderNumber: PropTypes.bool,
    hideAllMeta: PropTypes.bool,
    preferSummary: PropTypes.bool,
    inPlaylistView: PropTypes.bool,
    inPlaylistPage: PropTypes.bool,
    playlistActiveItem: PositiveIntegerOrZero,
    playlistId: PropTypes.string,
    /* ################################################## */
    maxItems: PropTypes.number.isRequired,
    pageItems: PropTypes.number.isRequired,
    horizontalItemsOrientation: PropTypes.bool.isRequired,
    singleLinkContent: PropTypes.bool.isRequired,
    inTagsList: PropTypes.bool,
    inCategoriesList: PropTypes.bool,
    itemsCountCallback: PropTypes.func,
    itemsLoadCallback: PropTypes.func,
    firstItemViewer: PropTypes.bool,
    firstItemDescr: PropTypes.bool,
    canEdit: PropTypes.bool,
};

ItemList.defaultProps = {
    hideCategories: ! PageStore.get('config-media-item').displayCategories,
    hideDate: false,
    hideViews: false,
    hideAuthor: false,
    hidePlaylistOptions: true,
    hidePlaylistOrderNumber: true,
    hideAllMeta: false,
    preferSummary: false,
    inPlaylistView: false,
    inPlaylistPage: false,
    playlistActiveItem: 1,
    playlistId: void 0,
    /* ################################################## */
    maxItems: 99999,
    pageItems: 48,
    pageItems: 24,    // TODO: Is this override ok?
    horizontalItemsOrientation: false,
    singleLinkContent: false,
    inTagsList: false,
    inCategoriesList: false,
    firstItemViewer: false,
    firstItemDescr: false,
    canEdit: false,
};
