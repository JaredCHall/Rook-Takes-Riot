import {RiotComponent} from "riot";

export interface VisualizationProps {}

export interface VisualizationState {}

export interface VisualizationComponent extends RiotComponent<VisualizationProps,VisualizationState> {
    selectGame(gameName: string): void,
}