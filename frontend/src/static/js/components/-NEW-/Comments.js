import React, { useState, useRef, useEffect } from 'react';

import { format } from 'timeago.js';

import PropTypes from 'prop-types';

import { usePopup } from './hooks/usePopup';

import LinksContext from '../../contexts/LinksContext';
import UserContext from '../../contexts/UserContext';
import SiteContext from '../../contexts/SiteContext';

import PageStore from '../../pages/_PageStore.js';
import * as PageActions from '../../pages/_PageActions.js';

import MediaPageStore from '../../pages/MediaPage/store.js';
import * as MediaPageActions from '../../pages/MediaPage/actions.js';

import { CircleIconButton } from './CircleIconButton';
import { MaterialIcon } from './MaterialIcon';
import { UserThumbnail } from './UserThumbnail';

import { PopupMain } from './Popup';

import stylesheet from "../styles/Comments.scss";

const commentsText = {
	single: 'comment',
	uppercaseSingle: 'COMMENT',
	ucfirstSingle: 'Comment',
	ucfirstPlural: 'Comments',
	submitCommentText: 'SUBMIT',
	// disabledCommentsMsg: 'Commentaries are disabled',
	disabledCommentsMsg: 'Comments are disabled',
};

function CommentForm(props){

	const textareaRef = useRef(null);

	const [ value, setValue ] = useState('');
	const [ madeChanges, setMadeChanges ] = useState(false);
	const [ textareaFocused, setTextareaFocused ] = useState(false);
	const [ textareaLineHeight, setTextareaLineHeight ] = useState(-1);

	const [ loginUrl ] = useState( ! UserContext._currentValue.is.anonymous ? null : LinksContext._currentValue.signin + "?next=/" + window.location.href.replace( SiteContext._currentValue.url, '' ).replace(/^\//g, '') );

	function onFocus(){
		setTextareaFocused(true);
	}

	function onBlur(){
		setTextareaFocused(false);
	}

	function onCommentSubmit(){

		textareaRef.current.style.height = '';
		
		const contentHeight = textareaRef.current.scrollHeight;
		const contentLineHeight = 0 < textareaLineHeight ? textareaLineHeight : parseFloat( window.getComputedStyle( textareaRef.current ).lineHeight );

		setValue('');
	 	setMadeChanges(false);
		setTextareaLineHeight(contentLineHeight);

		textareaRef.current.style.height = Math.max( 20, ( textareaLineHeight * Math.ceil( contentHeight / contentLineHeight ) ) ) + 'px';
	}

	function onCommentSubmitFail(){
		setMadeChanges(false);
	}

	function onChange(event){
		
		textareaRef.current.style.height = '';

		const contentHeight = textareaRef.current.scrollHeight;
		const contentLineHeight = 0 < textareaLineHeight ? textareaLineHeight : parseFloat( window.getComputedStyle( textareaRef.current ).lineHeight );

		setValue(textareaRef.current.value);
	 	setMadeChanges(true);
		setTextareaLineHeight(contentLineHeight);

		textareaRef.current.style.height = Math.max( 20, ( textareaLineHeight * Math.ceil( contentHeight / contentLineHeight ) ) ) + 'px';
	}

	function submitComment(){
		
		if( ! madeChanges ){
			return;
		}

		const val = textareaRef.current.value.trim();
		
		if( '' !== val ){
			MediaPageActions.submitComment(val);
		}
	}

	useEffect(() => {

		MediaPageStore.on("comment_submit", onCommentSubmit);
		MediaPageStore.on("comment_submit_fail", onCommentSubmitFail);

		return () => {
			MediaPageStore.removeListener("comment_submit", onCommentSubmit);
			MediaPageStore.removeListener("comment_submit_fail", onCommentSubmitFail);
		};
	});

	return (! UserContext._currentValue.is.anonymous ? <div className="comments-form">
					<div className="comments-form-inner">
						<UserThumbnail />
						<div className="form">
							<div className={ "form-textarea-wrap" + ( textareaFocused ? " focused" : "" ) }>
								<textarea ref={ textareaRef } className="form-textarea" rows="1" placeholder={"Add a " + commentsText.single + "..."} value={ value } onChange={onChange} onFocus={onFocus} onBlur={onBlur}></textarea>
							</div>
							<div className="form-buttons">
								<button className={ '' === value.trim() ? "disabled" : "" } onClick={ submitComment }>{ commentsText.submitCommentText }</button>
							</div>
						</div>
					</div>
				</div> :
				<div className="comments-form">
					<div className="comments-form-inner">
						<UserThumbnail />
						<div className="form">
	
							<a href={ loginUrl } rel="noffolow" className="form-textarea-wrap" title={ "Add a " + commentsText.single + "..." }>
								<span className="form-textarea">{ "Add a " + commentsText.single + "..." }</span>
							</a>
							<div className="form-buttons">
								<a href={ loginUrl } rel="noffolow" className="disabled">{ commentsText.submitCommentText }</a>
							</div>
						</div>
					</div>
				</div>);
}

CommentForm.propTypes = {
	comment_type: PropTypes.oneOf([ 'new', 'reply' ]),
	media_id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
	reply_comment_id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
};

CommentForm.defaultProps = {
	comment_type: 'new',
};

const ENABLED_COMMENTS_READ_MORE = false;

function CommentActions(props){

	const [ popupContentRef, PopupContent, PopupTrigger ] = usePopup();

	function cancelCommentRemoval(){
		popupContentRef.current.toggle();
	}

	function proceedCommentRemoval(){
		popupContentRef.current.toggle();
		MediaPageActions.deleteComment( props.comment_id );
	}

	return (<div className="comment-actions">

				{/*<div className="comment-action like-action"><CircleIconButton><MaterialIcon type="thumb_up" /></CircleIconButton><span className="likes-num">145</span></div>*/}
				{/*<div className="comment-action dislike-action"><CircleIconButton><MaterialIcon type="thumb_down" /></CircleIconButton><span className="dislikes-num">19</span></div>*/}
				{/*<div className="comment-action replay-comment"><button>REPLY</button></div>*/}

				{ UserContext._currentValue.can.deleteComment ? <div className="comment-action remove-comment">

					<PopupTrigger contentRef={ popupContentRef }>
						<button>DELETE { commentsText.uppercaseSingle }</button>
					</PopupTrigger>

					<PopupContent contentRef={ popupContentRef }>
						<PopupMain>
							<div className="popup-message">
								<span className="popup-message-title">{ commentsText.ucfirstSingle } removal</span>
								<span className="popup-message-main">You're willing to remove { commentsText.single } permanently?</span>
							</div>
					  		<hr/>
							<span className="popup-message-bottom">
								<button className="button-link cancel-comment-removal" onClick={ cancelCommentRemoval }>CANCEL</button>
								<button className="button-link proceed-comment-removal" onClick={ proceedCommentRemoval }>PROCEED</button>
							</span>
					  	</PopupMain>
					</PopupContent>

				</div> : null }

			</div>);
}

/*function CommentReplies(){
	return (<div className="comment-replies"><div className="comment-replies-inner"></div></div>);
}*/

function Comment(props){

	const commentTextRef = useRef(null);
	const commentTextInnerRef = useRef(null);

	const [ viewMoreContent, setViewMoreContent ] = useState( ! ENABLED_COMMENTS_READ_MORE || false );
	const [ enabledViewMoreContent, setEnabledViewMoreContent ] = useState(false);

	function onWindowResize(){
		const newval = enabledViewMoreContent || commentTextInnerRef.offsetHeight > commentTextRef.offsetHeight;
		setEnabledViewMoreContent( newval );
		setViewMoreContent( newval || false );
	}

	function toggleMore(){
		setViewMoreContent( ! viewMoreContent );
	}

	useEffect(()=>{

		if( ENABLED_COMMENTS_READ_MORE ){
			PageStore.on('window_resize', onWindowResize );
			setEnabledViewMoreContent( commentTextInnerRef.offsetHeight > commentTextRef.offsetHeight );
		}

		return () => {
			if( ENABLED_COMMENTS_READ_MORE ){
				PageStore.removeListener('window_resize', onWindowResize );
			}
		};
	},[]);

	return (<div className="comment">
				<div className="comment-inner">
					<a className="comment-author-thumb" href={ props.author_link } title={ props.author_name }><img src={ props.author_thumb } alt={ props.author_name } /></a>
					<div className="comment-content">
						<div className="comment-meta">
							<div className="comment-author"><a href={ props.author_link } title={ props.author_name }>{ props.author_name }</a></div>
							<div className="comment-date">{ format( new Date( props.publish_date ) ) }</div>
						</div>
						<div ref={ commentTextRef } className={ "comment-text" + ( viewMoreContent ? " show-all" : '' ) }>
							<div ref={ commentTextInnerRef } className="comment-text-inner" dangerouslySetInnerHTML={ { __html: props.text } }></div>
						</div>
						{ enabledViewMoreContent ? <button className="toggle-more" onClick={ toggleMore }>{ viewMoreContent ? "Show less" : "Read more" }</button> : null }
						{ UserContext._currentValue.can.deleteComment ? <CommentActions comment_id={ props.comment_id } /> : null }
						{/*<CommentReplies/>*/}
					</div>
				</div>
			</div>);
}

Comment.propTypes = {
	comment_id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
	media_id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]).isRequired,
	text: PropTypes.string,
	author_name: PropTypes.string,
	author_link: PropTypes.string,
	author_thumb: PropTypes.string,
	publish_date: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
	likes: PropTypes.number,
	dislikes: PropTypes.number,
};

Comment.defaultProps = {
	author_name: '',
	author_link: '#',
	publish_date: 0,
	likes: 0,
	dislikes: 0,
};

function displayCommentsRelatedAlert(){

	var pageMainEl = document.querySelector('.page-main');
	var noCommentDiv = pageMainEl.querySelector('.no-comment');

	// TODO: Improve this and move it into Media Page code.

	const postUploadMessage = PageStore.get('config-contents').uploader.postUploadMessage;

	if( '' === postUploadMessage ){

		if( noCommentDiv && 0 === comm.length ){
    		noCommentDiv.parentNode.removeChild( noCommentDiv );				
		}
	}
	else if( 0 === comm.length && 'unlisted' === MediaPageStore.get('media-data').state ){

        if( -1 < LinksContext._currentValue.profile.home.indexOf( MediaPageStore.get('media-data').author_profile ) ){

			if( ! noCommentDiv ){

				const missingCommentariesUnlistedMsgElem = document.createElement( 'div' );

				missingCommentariesUnlistedMsgElem.setAttribute( 'role', 'alert' );
				missingCommentariesUnlistedMsgElem.setAttribute( 'class', 'alert info alert-dismissible no-comment' );
				missingCommentariesUnlistedMsgElem.innerHTML = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>' + postUploadMessage;

				if( pageMainEl.firstChild ){
					pageMainEl.insertBefore(missingCommentariesUnlistedMsgElem, pageMainEl.firstChild);
				}
				else{
					pageMainEl.appendChild(missingCommentariesUnlistedMsgElem);
				}

			    missingCommentariesUnlistedMsgElem.querySelector('button.close').addEventListener( "click", function(ev){
			    	missingCommentariesUnlistedMsgElem.setAttribute('class', 'alert info alert-dismissible hiding');
			    	setTimeout( function(){
						missingCommentariesUnlistedMsgElem.parentNode.removeChild(missingCommentariesUnlistedMsgElem);
					}, 400 );
			    	ev.preventDefault();
			    	ev.stopPropagation();
			    	return false;
			    });
			}
		}
    }
    else if( noCommentDiv && 0 < comm.length ){
    	noCommentDiv.parentNode.removeChild( noCommentDiv );
	}
}

export default function CommentsList(props){

	const [ mediaId, setMediaId ] = useState( MediaPageStore.get( 'media-id' ) );
	const [ comments, setComments ] = useState( UserContext._currentValue.can.readComment ? MediaPageStore.get('media-comments') : [] );
	const [ displayComments, setDisplayComments ] = useState(false);

	function onCommentsLoad(){
		displayCommentsRelatedAlert();
		setComments( MediaPageStore.get('media-comments') );
	}
	
	function onCommentSubmit(commentId){
		
		onCommentsLoad();

		// TODO: Re-check this.
		setTimeout(function(){	// @note: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].
			PageActions.addNotification( commentsText.ucfirstSingle + " added", 'commentSubmit');
		}, 100);
		
		console.info("Added " + commentsText.single + ' "' + commentId + '"');
	}

	function onCommentSubmitFail(){
		// TODO: Re-check this.
		setTimeout(function(){	// @note: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].
			PageActions.addNotification( commentsText.ucfirstSingle + " submition failed", 'commentSubmitFail');
		}, 100);
	}

	function onCommentDelete( commentId ){
		
		onCommentsLoad();

		// TODO: Re-check this.
		setTimeout(function(){	// @note: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].
			PageActions.addNotification( commentsText.ucfirstSingle + " removed", 'commentDelete');
		}, 100);
		
		console.info("Removed " + commentsText.single + ' "' + commentId + '"' );
	}

	function onCommentDeleteFail( commentId ){
		
		// TODO: Re-check this.
		setTimeout(function(){	// @note: Without delay creates conflict [ Uncaught Error: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch. ].
			PageActions.addNotification( commentsText.ucfirstSingle + " removal failed", 'commentDeleteFail');
		}, 100);

		console.info(commentsText.ucfirstSingle + ' "' + commentId + '"' + " removal failed");
	}

	useEffect(()=>{
		setDisplayComments( comments.length && UserContext._currentValue.can.readComment && ( MediaPageStore.get( 'media-data' ).enable_comments || UserContext._currentValue.can.editMedia ) );		
	}, [comments]);

	useEffect(()=>{

		MediaPageStore.on("comments_load", onCommentsLoad);
		MediaPageStore.on("comment_submit", onCommentSubmit);
		MediaPageStore.on("comment_submit_fail", onCommentSubmitFail);
		MediaPageStore.on("comment_delete", onCommentDelete);
		MediaPageStore.on("comment_delete_fail", onCommentDeleteFail);

		return () => {

			MediaPageStore.removeListener("comments_load", onCommentsLoad);
			MediaPageStore.removeListener("comment_submit", onCommentSubmit);
			MediaPageStore.removeListener("comment_submit_fail", onCommentSubmitFail);
			MediaPageStore.removeListener("comment_delete", onCommentDelete);
			MediaPageStore.removeListener("comment_delete_fail", onCommentDeleteFail);
		};
	}, []);

	return (<div className="comments-list">
	
					<div className="comments-list-inner">
	
						{ ! UserContext._currentValue.can.readComment || MediaPageStore.get( 'media-data' ).enable_comments ? null : <span className="disabled-comments-msg">{ commentsText.disabledCommentsMsg }</span> }
	
						{ UserContext._currentValue.can.readComment && ( MediaPageStore.get( 'media-data' ).enable_comments || UserContext._currentValue.can.editMedia ) ? <h2>{ comments.length ?
							( 1 < comments.length ? comments.length + " " + commentsText.ucfirstPlural : comments.length + " " + commentsText.ucfirstSingle ) :
							( MediaPageStore.get( 'media-data' ).enable_comments ? "No " + commentsText.single + " yet" : '' )
						}</h2> : null }
	
						{ /*UserContext._currentValue.can.addComment && MediaPageStore.get( 'media-data' ).enable_comments ? <CommentForm media_id={ mediaId } /> : null*/ }
	
						{ MediaPageStore.get( 'media-data' ).enable_comments ? <CommentForm media_id={ mediaId } /> : null }
	
						{ displayComments ? comments.map( c => 
							<Comment key = { c.uid }
								comment_id = { c.uid }
								media_id = { mediaId }
								text = { c.text }
								author_name = { c.author_name }
								author_link = { c.author_profile }
								author_thumb = { SiteContext._currentValue.url + '/' + c.author_thumbnail_url.replace(/^\//g, '') }
								publish_date = { c.add_date }
								likes = { 0 }
								dislikes = { 0 }
							/>
						) : null}
	
					</div>
	
				</div>);
}
