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
import Main from '../electron/main';
import {
    NotificationDesigns,
    NotificationFactoryOpts,
    NotificationPosition
} from './interfaces';
import { NotificationEvents } from './notification-events';
import { Queue } from '../utils/queue';
const queue = new Queue();

export class CustomHtmlNotification extends NotificationEvents {
    private electronWindow: Main;
    private notification: Electron.BrowserWindow;

    constructor(opts: Partial<NotificationFactoryOpts>) {
        super();
        this.electronWindow = new Main(
            opts.design as NotificationDesigns,
            opts as NotificationPosition
        );
        this.notification = this.electronWindow.createNotificationWindow();
        queue.subscribe(this.notification);
        queue.add(this.notification.show);
    }
}
