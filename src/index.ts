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
    NotificationOpts
} from './notifications/interfaces';

export class NotificationFactory {
    private customHtmlNotification: CustomHtmlNotification;

    constructor(content: NotificationOpts, opts: Partial<NotificationFactoryOpts> = {
        type: NotificationType.HTML,
        backgroundColor: '#fff',
        flash: false,
        persistent: false,
        corner: 'upper-right'
    }) {
        this.customHtmlNotification = new CustomHtmlNotification(opts);
    }

    public show() {
        this.customHtmlNotification.show();
    }

}
