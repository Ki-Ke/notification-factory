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
import * as electron from 'electron';
import { NotificationPosition } from './interfaces';

const queue = new Queue();

interface Position {
    x: number;
    y: number;
}

export class NotificationWindowHandler {
    private posX: number;
    private posY: number;
    private padding: number = 8;
    private notificationWindows: Electron.BrowserWindow[] = [];
    private bounds: Electron.Rectangle;
    private _position: NotificationPosition = { corner: 'upper-right', display: ''};

    constructor() {
        this.posX = 0;
        this.posY = 0;
        this.bounds = { height: 340, width: 70, x: 0, y: 0 };
    }

    /**
     * Handle queue and showing notifications
     * @param {Electron.BrowserWindow} window
     */
    public add(window: Electron.BrowserWindow) {
        this.bounds = window.getBounds();
        this.notificationWindows.push(window);

        queue.subscribe((notificationWin: Electron.BrowserWindow) => this.show(notificationWin));
        queue.add(window);
    }

    /**
     * Removes the notification ref when the window is closed
     * @param {number} id
     */
    public remove(id: number) {
        const notificationWindow = BrowserWindow.fromId(id);
        const index = this.notificationWindows.indexOf(notificationWindow);
        if (index !== -1) this.notificationWindows.splice(index, 1);
        this.updateAllNotificationPosition(index);
        console.log(`notification Index ${index}`);
    }

    /**
     * Updates notification position for the given notification id
     * @param {number} id
     * @param {NotificationPosition} position
     */
    public updatePosition(id: number, position: NotificationPosition = this._position) {

        const { x, y } = this.calculateNotificationPosition(position);

        const browserWindow = BrowserWindow.fromId(id);
        browserWindow.setPosition(x, y, true);
    }

    /**
     * Maps throw active notification and updates it position
     * @param {NotificationPosition} position
     * @param index
     */
    public updateAllNotificationPosition(
        index: number,
        position: NotificationPosition = this._position
    ) {
        this.notificationWindows.map((window) => {
            const bounds = window.getBounds();
            const { x, y } = this.calculateNextRemoveNotificationPos(bounds);
            window.setPosition(x, y, true);
        });
    }

    /**
     * Calculates first notification insert position
     * @param {NotificationPosition} position
     * @return {Position}
     */
    private calculateNotificationPosition(
        position: NotificationPosition = this._position
    ): Position {
        const display: Electron.Display = electron.screen.getPrimaryDisplay();

        if (this.notificationWindows.length > 0) {
            return this.calculateNextInsertNotificationPos();
        }

        this.posX = display.workArea.x;
        this.posY = display.workArea.y;

        switch (position.corner) {
            case 'upper-right':
                this.posX += display.workAreaSize.width;
                break;
            case 'lower-right':
                this.posX += display.workAreaSize.width;
                this.posY += display.workAreaSize.height;
                break;
            case 'lower-left':
                this.posY += display.workAreaSize.height;
                break;
            case 'upper-left':
            default:
                break;
        }

        return { x: this.posX, y: this.posY };
    }

    /**
     * Calculates next notification insert position
     * @param {NotificationPosition} position
     * @return {Position}
     */
    private calculateNextInsertNotificationPos(
        position: NotificationPosition = this._position
    ): Position {
        let y;
        switch (position.corner) {
            case 'upper-right':
            case 'upper-left':
                y = this.posY +
                    ((this.bounds.height + this.padding) * this.notificationWindows.length);
                break;

            default:
            case 'lower-right':
            case 'lower-left':
                y = this.posY - ((this.bounds.height + this.padding) *
                    (this.notificationWindows.length + 1));
                break;
        }

        return { x: this.posX, y };
    }

    private calculateNextRemoveNotificationPos(
        bounds: Electron.Rectangle,
        position: NotificationPosition = this._position
    ): Position {
        let y;
        switch (position.corner) {
            case 'upper-right':
            case 'upper-left':
                y = bounds.y - (this.bounds.height + this.padding);
                break;

            default:
            case 'lower-right':
            case 'lower-left':
                y = bounds.y + (this.bounds.height + this.padding);
                break;
        }

        return { x: bounds.x, y };
    }

    /**
     * Emitted when the renderer process has rendered the page
     * @param {Electron.BrowserWindow} win
     */
    private show(win: Electron.BrowserWindow) {
        win.once('ready-to-show', () => win.showInactive());
    }

    /**
     * Notification Window Handler setters and getters
     */

    /**
     * Sets notification position
     * @param {NotificationPosition} position
     */
    set position(position: NotificationPosition) {
        this._position = position;
    }
}
