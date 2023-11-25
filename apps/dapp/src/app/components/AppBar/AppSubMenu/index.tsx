import { SetStateAction, useCallback, useState } from 'react';

import AppLink from '../AppLink';
import { LinkType } from '../types';

interface AppSubMenuProps {
  menuName: string;
  links: LinkType[];
}

const AppSubMenu = ({ menuName, links }: AppSubMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = useCallback(
    (event: { currentTarget: SetStateAction<HTMLElement | null> }) =>
      setAnchorEl(event.currentTarget),
    [],
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);

  return (
    <>
      <div
        role="button"
        onClick={handleClick}
        className="cursor-pointer text-white hover:text-frost"
      >
        {menuName}
      </div>

      {/* <Menu
        data={links}
        selection={selection}
        setSelection={setSelection}
        dropdownVariant="icon"
      /> */}

      {/* <Menu>
        {links.map((link) => {
          return (
            <MenuItem onClick={handleClose} key={link.name}>
              <div className="flex flex-col">
                <AppLink to={link.to || ''} name={link.name}>
                  <div className="text-sm text-white">{link.name}</div>
                  <div className="text-xs text-stieglitz">
                    {link.description}
                  </div>
                </AppLink>
              </div>
            </MenuItem>
          );
        })}
      </Menu> */}
    </>
  );
};

export default AppSubMenu;
