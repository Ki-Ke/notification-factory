/*
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
*/
import { ipcMain, BrowserWindow } from 'electron';
import Main from '../electron/main';
import {
    NotificationContent,
    NotificationFactoryOpts,
    NotificationPosition
} from './interfaces';
import { NotificationWindowHandler } from './notification-window-handler';

const notificationWindowHandler = new NotificationWindowHandler();

export class CustomHtmlNotification {
    private electronWindow: Main;
    private readonly notification: Electron.BrowserWindow;
    private readonly opts: Partial<NotificationFactoryOpts>;

    constructor(
        content: Partial<NotificationContent>,
        opts: Partial<NotificationFactoryOpts>,
        position: Partial<NotificationPosition>
    ) {
        this.opts = opts;
        this.electronWindow = new Main(opts, position);
        // create a notification window
        this.notification = this.electronWindow.createNotificationWindow();
        this.notification.webContents.on('did-finish-load', () => {
            this.setContent(content, this.opts);
        });

        // Notification window handler stuff
        notificationWindowHandler.position = position;
        notificationWindowHandler.updatePosition(this.notification.id);
        notificationWindowHandler.add(this.notification);

        this.notification.once('close', this.notificationClosed.bind(this));
    }

    private notificationClosed() {
        notificationWindowHandler.remove(this.notification.id);
        if (typeof this.opts.closeNotification === 'function') {
            this.opts.closeNotification({ id: this.notification.id });
        }
    }

    /**
     * Sets notification contents
     * @param content
     * @param {Partial<NotificationFactoryOpts>} opts
     */
    private setContent(
        content: Partial<NotificationContent>,
        opts: Partial<NotificationFactoryOpts>
    ) {
        this.notification.webContents.send('set-content', content, opts);
    }
}

ipcMain.on('close-notification', (event: Electron.Event) => {
    const notification = BrowserWindow.fromWebContents(event.sender);
    notification.close();
});
