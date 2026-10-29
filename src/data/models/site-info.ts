export type SocialChannel = {
  name: string;
  /** Owner decision: no URLs. Render as plain text, never as a link. */
  url: null;
};

export type SiteInfo = {
  careline: { label: string; number: string; tel: string; description: string };
  email: { address: string; href: string; description: string };
  socials: SocialChannel[];
};
