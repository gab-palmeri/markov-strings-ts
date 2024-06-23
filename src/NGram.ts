class NGram {
	tokens: string[];
	
	constructor(tokens: string[]) {
		this.tokens = tokens;
	}
	
	key(): string {
		return this.tokens.join('_');
	}
}

export { NGram };