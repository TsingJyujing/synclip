export function* Counter(n: number) {
    for (let i = 0; i < n; i++) {
        yield i
    }
}