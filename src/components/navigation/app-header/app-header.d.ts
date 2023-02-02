import {RiotComponent} from "riot";
// @ts-ignore
import {AppComponent} from "App/app.d.ts";

export interface AppHeaderProps {
    app: AppComponent
}

export interface AppHeaderState {
}

export interface AppHeaderComponent extends RiotComponent<AppHeaderProps,AppHeaderState> {}