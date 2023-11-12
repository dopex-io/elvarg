import { FC, ReactNode } from 'react';

const FooterLink: FC<{
  href: string;
  rel?: string;
  target?: string;
  name?: string;
  Icon?: FC<{ className: string }>;
  imgSrc?: string;
  children?: ReactNode;
}> = (props) => {
  const { name, children, Icon, imgSrc, href, target, rel } = props;
  const anchorProps = { href, target, rel };
  return (
    <li className="mb-2 flex items-center space-x-2">
      {Icon ? <Icon className="text-stieglitz  w-5 h-5" /> : null}
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={name}
          className="h-5 w-5 dark:invert dark:brightness-0 filter"
        />
      ) : null}
      <a className="text-white" {...anchorProps}>
        {name ? name : children}
      </a>
    </li>
  );
};

const Footer = () => {
  return (
    <div className="flex flex-col m-auto md:flex-row mx-auto w-full py-24 bg-black bg-opacity-30">
      <div className="mx-auto flex">
        <div className="flex flex-col mb-6 md:mr-16">
          <img
            src="/images/brand/logo.svg"
            alt="logo"
            className="w-10 h-10 my-2 mr-7 md:mb-4"
          />
          <p>© Dopex 2023</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-28">
          <div className="flex flex-col">
            <p className="text-lg mb-2 gradientText">Knowledge</p>
            <ul>
              <FooterLink
                name={'Docs'}
                href="https://docs.dopex.io/"
                target="_blank"
                rel="noopener noreferrer"
              />
              <FooterLink
                name={'Blog'}
                href="https://blog.dopex.io/"
                target="_blank"
                rel="noopener noreferrer"
              />
              <FooterLink
                name={'Learn'}
                href="https://learn.dopex.io"
                target="_blank"
                rel="noopener noreferrer"
              />
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="gradientText text-lg mb-2">Community</p>
            <ul>
              <FooterLink
                name={'Discord'}
                href="https://discord.gg/dopex"
                target="_blank"
                rel="noopener noreferrer"
              />
              <FooterLink
                name={'Twitter'}
                href="https://twitter.com/dopex_io"
                target="_blank"
                rel="noopener noreferrer"
              />
              <FooterLink
                name={'DeBank'}
                href="https://debank.com/official-account/113048"
                target="_blank"
                rel="noopener noreferrer"
              />
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="gradientText text-lg mb-2">Developers</p>
            <ul>
              <FooterLink
                name={'Github'}
                href="https://github.com/dopex-io"
                target="_blank"
                rel="noopener noreferrer"
              />
              <FooterLink
                name={'Bug Bounty'}
                href="https://github.com/dopex-io/bug-bounty"
                target="_blank"
                rel="noopener noreferrer"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
