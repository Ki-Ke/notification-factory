/**
 Copyright 2018 KiKe. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 **/

'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const { NotificationFactory } = require('../lib/index');
const path = require('path');

let mainWindow;

const preload = path.join(__dirname, '/preload.js');

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            sandbox: false,
            nodeIntegration: false,
            preload: preload,
            nativeWindowOpen: true
        }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

// Preload event listeners
ipcMain.on('show-notification', () => {
    const notification = new NotificationFactory({ title: 'akon', body: 'test notification message' }, { design: 'simple' });

    notification.on('close', (e, arg) => {
        console.log('notification event ' + arg.id);
    });
});

