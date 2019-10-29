import React from 'react';
import { hydrate } from 'react-dom';
import { App } from "../common/components/App";

hydrate(
  <App />,
  document.getElementById('root')
);
