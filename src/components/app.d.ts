import {RiotComponent} from "riot";

export interface AppProps {}

export interface AppState {
    page: string,
}

export interface AppComponent extends RiotComponent<AppProps,AppState> {
    setCurrentRoute(path: string): void,
}