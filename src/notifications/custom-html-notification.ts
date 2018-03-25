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
import ElectronWindowHandler from '../electron-window-handler';
import {
    NotificationDesigns,
    NotificationFactoryOpts,
    NotificationPosition
} from './interfaces';

export class CustomHtmlNotification {
    private electronWindow: ElectronWindowHandler;
    private notification: Electron.BrowserWindow;

    constructor(opts: Partial<NotificationFactoryOpts>) {
        this.electronWindow = new ElectronWindowHandler(
            opts.design as NotificationDesigns,
            opts as NotificationPosition
        );
        this.notification = this.electronWindow.createNotificationWindow();
    }

    public show() {
        this.notification.show();
    }
}
