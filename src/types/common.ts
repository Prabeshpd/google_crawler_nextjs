export interface ISelectorId {
  adTopParent: string;
  adBottomParent: string;
  linkElement: string;
  adLinkElementAttribute: string;
  adWords: string;
  nonAdWords: string;
  nonAdParent: string;
  linkElementAttribute: string;
}

export type Credentials = Record<'email' | 'password', string> | undefined;
