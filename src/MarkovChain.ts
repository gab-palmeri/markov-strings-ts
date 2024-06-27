import { FrequencyMat } from "./FrequencyMat";
import { NGram } from "./NGram";
import { Pair } from "./Pair";
import { StatePool } from "./StatePool";
import { StartToken, EndToken } from "./const";


interface MarkovChainInput {
    order: number;
    statePool: { [key: string]: number };
    frequencyMat: { [key: string]: { [key: string]: number } };
}

class MarkovChain {
	order: number;
	statePool: StatePool;
	frequencyMat: FrequencyMat;
	
	constructor(order: number) {
		this.order = order;
		this.statePool = new StatePool();
		this.frequencyMat = new FrequencyMat();
	}
	
	public add(text: string): void {

		const words = text.split(' ');

		//for each string separate punctuation (only !?.",) and words, then convert to lowercase
		const cleanWords: string[] = [];
		const regex = /[\w']+|[!?.",]/g;
		
		for (const token of words) {
			const parts = token.match(regex) || [];
			parts.forEach(part => {
				cleanWords.push(part.toLowerCase());
			});
		}

		const startTokens = Array(this.order).fill(StartToken);
		const endTokens = Array(this.order).fill(EndToken);
		const tokens = [...startTokens, ...cleanWords, ...endTokens];
		
		const pairs = this.makePairs(tokens);
		
		pairs.forEach(pair => {
			const currentIndex = this.statePool.add(pair.currentState.key());
			const nextIndex = this.statePool.add(pair.nextState);

			if(currentIndex === undefined || nextIndex === undefined) {
				throw new Error("Failed to add state to state pool");
			}
			
			if (!this.frequencyMat.hasState(currentIndex)) {
				this.frequencyMat.initializeState(currentIndex);
			}
			
			this.frequencyMat.incrementTransitionProbability(currentIndex, nextIndex);
		});
	}	

	public generate(): string {
		const order = this.order;
		
		const tokens: string[] = [];
		for (let i = 0; i < order; i++) {
			tokens.push(StartToken);
		}
		
		while (tokens[tokens.length - 1] !== EndToken) {
			const next = this.generateFromNGram(new NGram(tokens.slice(-order)));
			if (next) {
				tokens.push(next);
			}
		}
		let generatedText = tokens.slice(order, -1).join(' ');
		
		if (generatedText.trim().length === 0) {
			generatedText = this.generate();
		}
		
		return generatedText;
	}
	
	

	public toJSON(): object {
		return {
			"order": this.order,
			"statePool": this.statePool.toJSON(),
			"frequencyMat": this.frequencyMat.toJSON()
		};
	}

	public static fromJSON(jsonModel: MarkovChainInput): MarkovChain {

		const mc = new MarkovChain(jsonModel.order);
		mc.statePool = StatePool.fromJSON(jsonModel.statePool);
		mc.frequencyMat = FrequencyMat.fromJSON(jsonModel.frequencyMat);
		return mc;

	}

	private generateFromNGram(current: NGram): string | null {
		if (current.tokens.length !== this.order)
			throw new Error("N-gram length does not match chain order");
		
		if (current.tokens[this.order - 1] === EndToken) 
			return null;
		
		const currentIndex = this.statePool.getInt(current.key());
		
		
		if (currentIndex === undefined) {
			throw new Error(`Unknown ngram ${current.tokens}`);
		}
	
		const selectedKey = this.frequencyMat.selectNextToken(currentIndex);
		if(selectedKey != undefined) {
			return this.statePool.getString(selectedKey) || null;
		}
		
		return null;
	}

	private makePairs(tokens: string[]): Pair[] {
		const pairs: Pair[] = [];
		for (let i = 0; i <= tokens.length - this.order; i++) {
			const currentState = new NGram(tokens.slice(i, i + this.order));
			const nextState = tokens[i + this.order];
			pairs.push(new Pair(currentState, nextState));
		}
		return pairs;
	}
	
}


export { MarkovChain, StartToken, EndToken } ;
