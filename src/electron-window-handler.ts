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
import { NotificationDesigns } from './notifications/interfaces';

export interface WebPreferences {
    preload: string;
    sandbox: boolean;
    nodeIntegration: boolean;
}

export interface WindowOpts {
    alwaysOnTop: boolean;
    resizeable: boolean;
    show: boolean;
    frame: boolean;
    transparent: boolean;
    skipTaskbar: boolean;
    webPreferences: WebPreferences;
}

export class ElectronWindowHandler {

    public createNotificationWindow(design: NotificationDesigns): electron.BrowserWindow {
        const options = this.getWindowOpts();
        const browserWindow = new BrowserWindow(options);
        const resourcePath = this.getResourcePath(design);

        browserWindow.loadURL(resourcePath);
        this.disableNavigation(browserWindow);

        return browserWindow;
    }

    private getWindowOpts(): WindowOpts {
        return {
            alwaysOnTop: true,
            resizeable: false,
            show: false,
            frame: false,
            transparent: true,
            skipTaskbar: true,
            webPreferences: {
                preload: './preload-script',
                sandbox: true,
                nodeIntegration: false
            }
        };
    }

    /**
     * Resolves path
     *
     * @param {string} design
     * @return {string}
     */
    private getResourcePath(design: NotificationDesigns): string {
        return require.resolve(`./ui/${design}`);
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

const windowHandler = new ElectronWindowHandler();

export {
    windowHandler
};
