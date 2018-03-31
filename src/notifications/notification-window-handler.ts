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
import { BrowserWindow } from 'electron';
import { Queue } from '../utils/queue';

const queue = new Queue();

export class NotificationWindowHandler {
    private notificationWindows: Electron.BrowserWindow[] = [];

    public add(window: Electron.BrowserWindow) {
        this.notificationWindows.push(window);

        queue.subscribe((notificationWin: Electron.BrowserWindow) => notificationWin.show());
        queue.add(window);

    }

    public remove(id: number) {
        const notificationWindow = BrowserWindow.fromId(id);
        const index = this.notificationWindows.indexOf(notificationWindow);
        console.log(`notification Index ${index}`);
    }
}
