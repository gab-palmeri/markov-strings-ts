import { SparseArray } from "./SparseArray";

class FrequencyMat {

    private frequencyMat: Map<number, SparseArray>;

    constructor() {
		this.frequencyMat = new Map();
	}

    public hasState(state: number): boolean {
        return this.frequencyMat.has(state);
    }

    public initializeState(state: number) : void {
        this.frequencyMat.set(state, new SparseArray());
    }

    public incrementTransitionProbability(state: number, transition: number) {
        this.frequencyMat.get(state)!.increment(transition)
    }

    public selectNextToken(state: number): number | undefined {
        const arr = this.frequencyMat.get(state)!;
		let sum = arr.sum();
		let randN = Math.floor(Math.random() * sum);
		
		for (const key of arr.orderedKeys()) {
			const freq = arr.get(key);
			randN -= freq;
			if (randN < 0) {
				return key;
			}
		}
    }

    public toJSON(): object {

        const obj: any = {};
		this.frequencyMat.forEach((sparseArray, key) => {
			obj[key] = sparseArray.toJSON();
		});

        return obj;
    }

    static fromJSON(json: Record<string, Record<string, number>>): FrequencyMat {
        const frequencyMat = new FrequencyMat();
        Object.entries(json).forEach(([key, value]) => {
            const state = Number(key);
            const sparseArray = SparseArray.fromJSON(value);

            frequencyMat.frequencyMat.set(state, sparseArray);
        });
        return frequencyMat;
    }


}

export { FrequencyMat }