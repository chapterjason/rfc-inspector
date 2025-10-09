import * as monaco from "monaco-editor";

export class State implements monaco.languages.IState {
    constructor(readonly line: number) {
    }

    clone() {
        return new State(this.line);
    }

    equals(other: monaco.languages.IState) {
        return other instanceof State && other.line === this.line;
    }
}