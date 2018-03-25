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
import * as electron from 'electron';
import { BrowserWindow } from 'electron';
import { NotificationDesigns, NotificationPosition } from './notifications/interfaces';

export interface WebPreferences {
    preload: string;
    sandbox: boolean;
    nodeIntegration: boolean;
}

export interface WindowOpts {
    height: number | undefined;
    width: number | undefined;
    alwaysOnTop: boolean;
    resizeable: boolean;
    show: boolean;
    frame: boolean;
    transparent: boolean;
    skipTaskbar: boolean;
    webPreferences: WebPreferences;
}

export default class ElectronWindowHandler {
    private design: NotificationDesigns;
    private position: NotificationPosition;

    constructor(
        design: NotificationDesigns = NotificationDesigns.MAC_STYLE,
        position: NotificationPosition
    ) {
        this.design = design;
        this.position = position;
    }

    public createNotificationWindow(): electron.BrowserWindow {
        const options = this.getWindowOpts();
        const browserWindow = new BrowserWindow(options);
        const resourcePath = this.getResourcePath();

        browserWindow.loadURL(resourcePath);
        this.disableNavigation(browserWindow);

        return browserWindow;
    }

    /**
     * Returns the default Electron BrowserWindow opts
     *
     * @return {WindowOpts}
     */
    private getWindowOpts(): WindowOpts {
        const { width, height } = this.getWindowRect();
        return {
            height,
            width,
            alwaysOnTop: true,
            resizeable: false,
            show: false,
            frame: false,
            transparent: false,
            skipTaskbar: true,
            webPreferences: {
                preload: require.resolve('./preload-script'),
                sandbox: true,
                nodeIntegration: false
            }
        };
    }

    /**
     * Returns the width and height for the specific notification style
     *
     * @return {Partial<Electron.Rectangle>}
     */
    private getWindowRect(): Partial<electron.Rectangle> {
        switch (this.design) {
            case NotificationDesigns.MAC_STYLE:
                return { width: 350, height: 70 };
            default:
                return { width: 350, height: 70 };
        }
    }

    /**
     * Resolves path
     *
     * @return {string}
     */
    private getResourcePath(): string {
        return 'file://' + require.resolve(`./ui/${this.design}.html`);
    }

    /**
     * Prevent notification window form navigating
     *
     * @param { BrowserWindow } browserWindow
     */
    private disableNavigation(browserWindow: electron.BrowserWindow): void {
        const handleNavigation = (event: electron.Event) => {
            if (browserWindow.isDestroyed() || browserWindow.webContents.isDestroyed()) {
                return;
            }

            event.preventDefault();
        };

        browserWindow.webContents.on('will-navigate', handleNavigation);
    }

}
