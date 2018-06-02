import React from 'react';
import { Menu, Input } from 'semantic-ui-react';
import { Link } from '../routes'; // use curly braces to import one possible item of an import

export default () => {
  return (
    <Menu style={{ marginTop: '25px' }} >
      <Link route="/">
        <a className="item">
        KryptoCardz
        </a>
      </Link>

      <Menu.Menu position="right">

        <Link route="/campaigns/mydeck">
          <a className="item">My Deck</a>
        </Link>

        <Link route="/">
          <a className="item">Marketplace</a>
        </Link>

        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>


      </Menu.Menu>
    </Menu>
  );
};
