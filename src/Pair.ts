import { NGram } from "./NGram";

class Pair {
	currentState: NGram;
	nextState: string;
	
	constructor(currentState: NGram, nextState: string) {
		this.currentState = currentState;
		this.nextState = nextState;
	}
}

export { Pair };