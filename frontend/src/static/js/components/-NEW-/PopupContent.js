import React, { useEffect, useRef, useState, useImperativeHandle, useCallback } from 'react';
import { findDOMNode } from 'react-dom';

import { default as Popup } from './Popup';

import { hasClassname } from './functions/dom';

export function PopupContent(props){

	const wrapperRef = useRef(null);

	const [ isVisible, setVisibility ] = useState(false);

	const onClickOutside = useCallback((ev) => {
		
		if( hasClassname( ev.target, 'popup-fullscreen-overlay' ) ){
			// console.log('ON CLICK OUTSIDE #1');
			hide();
			return;
		}

		const domElem = findDOMNode( wrapperRef.current );

		if( -1 === ev.path.indexOf( domElem ) ){
			// console.log('ON CLICK OUTSIDE #2');
			hide();
		}
	}, []);

	const onKeyDown = useCallback((ev) => {
		// console.log('ON KEY DOWN');
		let key =  ev.keyCode || ev.charCode;
		if( 27 === key ){
			// TODO: Does it really need?
			onClickOutside(ev);
		}		
	}, []);

	function enableListeners(){
		// console.log("ENABLE LISTENERS");
		document.addEventListener('click', onClickOutside);
		document.addEventListener('keydown', onKeyDown);
	}

	function disableListeners(){
		// console.log("DISABLE LISTENERS");
		document.removeEventListener('click', onClickOutside);
		document.removeEventListener('keydown', onKeyDown);
	}

	function show(){
		setVisibility( true );
	}

	function hide(){
		disableListeners();
		setVisibility( false );
	}

	function toggle(){
		if( isVisible ){
			hide();
		}
		else{
			show();
		}
	}

	function tryToHide(){
		if( isVisible ){
			hide();
		}
	}

	function tryToShow(){
		if( !isVisible ){
			show();
		}
	}

	useEffect(() => {
		if( isVisible ){
			// console.log('VISIBLE');
			enableListeners();
			if( 'function' === typeof props.showCallback ){
				props.showCallback();
			};
		}
		else{
			// console.log('INVISIBLE')
			if( 'function' === typeof props.hideCallback ){
				props.hideCallback();
			};
		}
	}, [isVisible]);

	useImperativeHandle(props.contentRef, () => ({
		toggle,
		tryToHide,
		tryToShow,
	}));

	return ( isVisible ? <Popup ref={ wrapperRef } className={ props.className } style={ props.style }>{ props.children }</Popup> : null );
}