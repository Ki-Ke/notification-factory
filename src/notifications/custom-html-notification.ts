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
import { ipcMain } from 'electron';
import Main from '../electron/main';
import {
    NotificationDesigns,
    NotificationFactoryOpts,
    NotificationPosition
} from './interfaces';
import { NotificationEvents } from './notification-events';
import { NotificationWindowHandler } from './notification-window-handler';

const notificationWindowHandler = new NotificationWindowHandler();

export class CustomHtmlNotification extends NotificationEvents {
    private electronWindow: Main;
    private readonly notification: Electron.BrowserWindow;

    constructor(opts: Partial<NotificationFactoryOpts>) {
        super();
        this.electronWindow = new Main(
            opts.design as NotificationDesigns,
            opts as NotificationPosition
        );
        // create a notification window
        this.notification = this.electronWindow.createNotificationWindow();
        this.setContent(opts);
        notificationWindowHandler.add(this.notification);

        this.notification.once('close', (e) => notificationWindowHandler.remove(e.sender.id));
        ipcMain.once('close-notification', this.closeNotification.bind(this));
    }

    /**
     * Sets notification contents
     * @param {Partial<NotificationFactoryOpts>} opts
     */
    private setContent(opts: Partial<NotificationFactoryOpts>) {
        this.notification.webContents.send('set-content', opts);
    }

    /**
     * Closes the notification window
     * @param {Electron.Event} event
     */
    private closeNotification(event: Electron.Event) {
        if (event.sender.id === this.notification.id) {
            this.notification.close();
        }
    }
}
