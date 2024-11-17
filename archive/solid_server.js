#!/usr/bin/env node
// const { AppRunner } = require('..');

// https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/dev-configuration/#starting-the-server-through-code

import { AppRunner } from '@solid/community-server'


// const config = {
//     port: 3001
// }
// eslint-disable-next-line no-sync
new AppRunner().runCliSync(process);