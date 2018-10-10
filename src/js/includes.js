//backend
const fs = require('fs');
const path = require('path');
const storage = require('electron-storage');
const $ = require('jquery');
const { dialog } = require('electron').remote;
const {shell} = require('electron').remote;
const ncp = require('ncp').ncp;
const rimraf = require('rimraf');

ncp.limit = 16;

//frontend
const bootstrap = require("bootstrap");
const Vue = require('vue/dist/vue.js');
