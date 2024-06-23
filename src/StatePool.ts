class StatePool {
	private stringMap: Map<string, number>;
	private intMap: Map<number, string>;
	private counter: number;
	
	constructor() {
		this.stringMap = new Map();
		this.intMap = new Map();
		this.counter = 0;
	}
	
	add(str: string): number {
		if (!this.stringMap.has(str)) {
			this.stringMap.set(str, this.counter);
			this.intMap.set(this.counter, str);
			this.counter++;
		}
		return this.stringMap.get(str)!;
	}
	
	getString(key: number): string | undefined {
		return this.intMap.get(key);
	}
	
	getInt(str: string): number | undefined {
		return this.stringMap.get(str);
	}
	
	toJSON(): any {
		let spoolMap: any = {};
		this.stringMap.forEach((value, key) => {
			spoolMap[key] = value;
		});
		
		return spoolMap;
	}

	public static fromJSON(json: object): StatePool {
        let sp = new StatePool();

        Object.entries(json).forEach(([key, value]: [string, number]) => {
            const parsedKey = isNaN(Number(key)) ? key : Number(key); // Check if key is numeric
            sp.add(parsedKey.toString()); // Ensure key is treated as string
            sp.stringMap.set(parsedKey.toString(), value); // Set value in stringMap
            sp.intMap.set(value, parsedKey.toString()); // Set value in intMap
            if (value >= sp.counter) {
                sp.counter = value + 1; // Update counter if necessary
            }
        });

        return sp;
    }
}

export { StatePool }