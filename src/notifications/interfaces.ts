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

export interface NotificationContent {
    title: string;
    lang?: string;
    dir?: NotificationDirection;
    body?: string;
    tag?: string;
    icon?: string;
}

export interface NotificationPosition {
    corner?: string;
    display?: string;
}

export interface CustomNotificationOpts extends NotificationPosition {
    backgroundColor?: string;
    design?: string;
    flash?: boolean;
    persistent?: boolean;
    subTitle?: string;
    closeNotification?({}: any): any;
    clickNotification?(): any;
}

export interface NotificationFactoryOpts extends CustomNotificationOpts {
    type?: NotificationType;
}

export enum NotificationType {
    NATIVE,
    HTML
}

export enum NotificationDirection {
    AUTO,
    LTR,
    RTL
}

export enum NotificationDesigns {
    MAC_STYLE = 'mac-style',
    SIMPLE = 'simple'
}
