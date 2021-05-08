
export const assert = async (task: () => boolean|Promise<boolean>) => {
    let r: any = task();
    if (r instanceof Promise) r = await r;
    if (!r) {
        const msg = `assertion failed: ${task.toString()}`;
        console.error(msg);
        throw new Error(msg);
    }
};