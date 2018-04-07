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
import { CustomHtmlNotification } from './notifications/custom-html-notification';
import {
    NotificationFactoryOpts,
    NotificationType,
    NotificationPosition,
    NotificationContent
} from './notifications/interfaces';
import { NotificationEvents } from './notifications/notification-events';

export class NotificationFactory extends NotificationEvents {
    private customHtmlNotification: CustomHtmlNotification;
    private readonly opts: NotificationFactoryOpts;

    constructor(
        content: NotificationContent,
        opts: NotificationFactoryOpts = {
            type: NotificationType.HTML,
            backgroundColor: '#fff',
            flash: false,
            persistent: false,
            corner: 'upper-right',
            display: ''
        }
    ) {
        super();
        this.opts = opts;
        this.opts.closeNotification = this.closeNotification.bind(this);
        this.customHtmlNotification =
            new CustomHtmlNotification(content, this.opts, this.opts as NotificationPosition);
    }

    public closeNotification(arg: { id: number }) {
        this.emit('close', arg);
    }
}
