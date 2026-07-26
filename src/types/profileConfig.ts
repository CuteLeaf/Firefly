export type ProfileLinkInteraction = {
	qrCode?: string;
	qrCodeAlt?: string;
	copyText?: string;
	openDelayMs?: number;
};

export type ProfileLink = {
	name: string;
	url: string;
	icon: string;
	showName?: boolean;
	interaction?: ProfileLinkInteraction;
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: ProfileLink[];
};
