export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: ProfileLink[];
};

type ProfileLinkBase = {
	name: string;
	icon: string;
	showName?: boolean;
};

export type ProfileLink = ProfileLinkBase &
	(
		| {
				type?: "link";
				url: string;
		  }
		| {
				type: "dialog";
				value: string;
				title?: string;
		  }
	);
