/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 OpenAsar
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/settings";
import definePlugin, { OptionType } from "@utils/types";
import { Link } from "@components/Link";
import { Forms } from "@webpack/common";
const appIds = [
    "911790844204437504",
    "886578863147192350",
    "1020414178047041627",
    "1032800329332445255"
];


const settings = definePluginSettings({

    appName: {
        type: OptionType.STRING,
        description: "Presence Name"
    },
    typeChoice: {
        type: OptionType.SELECT,
        description: "Presence Type",
        options: [
            { label: "Listening", value: 2, default: true },
            { label: "Playing", value: 0 },
            { label: "Watching", value: 3 },
            { label: "Competing", value: 5 },
        ],
    },
    timeBar: {
        type: OptionType.BOOLEAN,
        default: true,
        description: "Show time bar (Client-side only)",
        restartNeeded: true
    },
});

export default definePlugin({
    name: "richerCider 2.0",
    description: "Enhances Cider (More details in info button) by allowing customization of Rich Presence when a suitable app ID is found.",
    authors: [{
        id: 191621342473224192n,
        name: "cryptofyre",
    },
    {
        id: 295671854104969216n,
        name: "nxahjs",
    }],
    patches: [
        {
            // Activity type and name
            find: '.displayName="LocalActivityStore"',
            replacement: {
                match: /LOCAL_ACTIVITY_UPDATE:function\((\i)\)\{/,
                replace: "$&$self.patchActivity($1.activity);",
            }
        },
        {
            // Activity time bar
            find: "renderTimeBar=function",
            replacement: [
                {
                match: /renderTimeBar=function\((.{1,3})\){.{0,50}?var/,
                replace: "renderTimeBar=function($1){var"
                }
            ],
            predicate: () => settings.store.timeBar,
            
        },
    ],
    settings,
    settingsAboutComponent: () => (
        <>
            <Forms.FormTitle tag="h3">Install Cider to use this Plugin</Forms.FormTitle>
            <Forms.FormText>
                <Link href="https://cider.sh">Follow the link to our website</Link> to get Cider up and running, and then enable the plugin.
            </Forms.FormText>
            <br></br>
            <Forms.FormTitle tag="h3">What is Cider?</Forms.FormTitle>
            <Forms.FormText>
                Cider is an open-source and community oriented Apple Music client for Windows, macOS, and Linux.
            </Forms.FormText>
            <br></br>
        </>
    ),

    patchActivity(activity: any) {
        if (appIds.includes(activity.application_id)) {
            activity.type = settings.store.typeChoice; 
            if (settings.store.appName) {
                activity.name = settings.store.appName;
            } else {
                activity.name = "Cider"
            }
        }
    },
});
