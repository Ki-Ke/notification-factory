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
'use strict';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs/Rx';
import { NotificationContent, NotificationFactoryOpts } from '../notifications/interfaces';

function initialize() {
    const notification = document.getElementById('container');
    console.log(notification);
    if (notification) {
        const mouseLeave = Observable.fromEvent(notification, 'mouseleave');
        const mouseOver = Observable.fromEvent(notification, 'mouseover');
        const mouseClick = Observable.fromEvent(notification, 'click');

        Observable.merge(
            Observable.timer(6000).takeUntil(mouseOver),
            mouseLeave.flatMap(() =>
                Observable.timer(3000).takeUntil(mouseOver)))
            .take(1)
            .subscribe(() => closeNotification());
    }
}

/**
 * Sets the notification content
 * @param {Electron.Event} event
 * @param content
 * @param {Object} opts
 */
function setNotificationContent(
    event: Electron.Event,
    content: Partial<NotificationContent>,
    opts: Partial<NotificationFactoryOpts>
) {
    initialize();
    const title = document.getElementById('title');
    const message = document.getElementById('message');
    const cancel = document.getElementById('cancel');

    if (title) title.innerText = content.title || '';
    if (message) message.innerText = content.body || '';

    if (cancel) cancel.addEventListener('click', () => {
        console.log('clocked close notification');
        ipcRenderer.send('close-notification');
    });
}

function closeNotification() {
    console.log('notification close event called');
    ipcRenderer.send('close-notification');
}

ipcRenderer.on('set-content', setNotificationContent);
