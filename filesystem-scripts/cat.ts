#!/usr/bin/env node

import * as fs from 'fs';

fs.createReadStream(String(process.argv[2])).pipe(process.stdout);
