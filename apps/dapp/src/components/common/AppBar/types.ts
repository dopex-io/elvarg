export type LinkType = {
  name: string;
  to?: string;
  description?: string;
  subLinks?: LinkType[];
};
