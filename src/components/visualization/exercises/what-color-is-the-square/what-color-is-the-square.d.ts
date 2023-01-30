import {RiotComponent} from "riot";

export interface WhatColorIsTheSquareProps {}

export interface WhatColorIsTheSquareState {
    isAnswered: boolean,
    expectedAnswer: string,
    isAnswerCorrect: boolean,
    square: string,
}

export interface WhatColorIsTheSquareComponent extends RiotComponent<WhatColorIsTheSquareProps,WhatColorIsTheSquareState> {
    askQuestion(): void,

    answerQuestion(): void,
}