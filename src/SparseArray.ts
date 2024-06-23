class SparseArray {

	private array: Map<number, number>;
	
	constructor() {
		this.array = new Map();
	}
	
	increment(key: number): void {
		this.array.set(key, (this.array.get(key) || 0) + 1);
	}
	
	get(key: number): number {
		return this.array.get(key) || 0;
	}
	
	sum(): number {
		let total = 0;
		this.array.forEach(value => total += value);
		return total;
	}
	
	orderedKeys(): number[] {
		return Array.from(this.array.keys()).sort((a, b) => a - b);
	}
	
	toJSON(): object {
		const arrayObject: { [key: string]: number } = {};
		this.array.forEach((value, key) => {
			arrayObject[key] = value;
		});
		return arrayObject;
	}

	static fromJSON(json: Record<string, number>): SparseArray {
        const sparseArray = new SparseArray();
        Object.entries(json).forEach(([key, value]) => {
            sparseArray.array.set(Number(key), value);
        });

        return sparseArray;
    }


	
}

export { SparseArray };