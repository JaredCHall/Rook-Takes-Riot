import {RiotComponent} from "riot";
// @ts-ignore
import {AppComponent} from "App/app.d.ts";

export interface SideBarProps {
    app: AppComponent
}

export interface SideBarState {
}

export interface SideBarComponent extends RiotComponent<SideBarProps,SideBarState> {}