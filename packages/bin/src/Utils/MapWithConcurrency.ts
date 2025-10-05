// concurrency-pool.ts
export async function mapWithConcurrency<I, O>(
    inputs: readonly I[],
    mapper: (item: I, index: number) => Promise<O>,
    concurrency = 10
): Promise<O[]> {
    if (concurrency < 1) {
        throw new Error("concurrency must be >= 1");
    }
    const results = new Array<O>(inputs.length);
    let next = 0;
    let active = 0;
    let completed = 0;
    let settled = false;

    return new Promise<O[]>((resolve, reject) => {
        const launch = () => {
            while (active < concurrency && next < inputs.length && !settled) {
                const i = next++;
                active++;

                Promise.resolve(mapper(inputs[i], i))
                    .then((val) => {
                        results[i] = val;
                    })
                    .catch((err) => {
                        if (!settled) {
                            settled = true;
                            reject(err);
                        }
                    })
                    .finally(() => {
                        if (settled) {
                            return;
                        }
                        active--;
                        completed++;
                        if (completed === inputs.length) {
                            settled = true;
                            resolve(results);
                        } else {
                            launch();
                        }
                    });
            }
        };

        if (inputs.length === 0) {
            settled = true;
            resolve(results);
            return;
        }
        launch();
    });
}