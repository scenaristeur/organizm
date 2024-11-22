import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('@babel/register')({
    presets: [['@babel/preset-env'], ['@babel/preset-react']]
  });

  import blessed from 'blessed';
  import {render} from 'react-blessed';
  

const Dashboard = require('./dashboard.jsx');
// require('./form.jsx');
// require('./context.jsx');

/**
 * Rendering the screen.
 */
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed dashboard'
});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

render(<Dashboard name="Bob DAsh" />, screen);