import { css } from '@emotion/react';

interface VideoProps {
	// link: string;
	imgUrl: string;
	title: string;
	userName: string;
}

const Video = ({ imgUrl, title, userName }: VideoProps) => {
	return (
		<div css={VideoContainer}>
			<img css={ThumbnailStyle} src={imgUrl} alt='썸네일' />
			<div css={VideoInfoStyle}>
				<span css={TitleStyle}>{title}</span>
				<span css={UserNameStyle}>{userName}</span>
			</div>
		</div>
	);
};

const VideoContainer = css`
	display: flex;
	cursor: pointer;
	margin-bottom: 10px;
`;

const ThumbnailStyle = css`
	width: 200px;
	height: 120px;
	margin-right: 10px;
	border-radius: 10px;
	/* padding: 10px; */
`;

const VideoInfoStyle = css`
	display: flex;
	flex-direction: column;
	padding: 5px 10px;
`;
const TitleStyle = css`
	color: gray;
`;
const UserNameStyle = css`
	color: black;

	&:hover {
		text-decoration: underline;
	}
`;

export default Video;
