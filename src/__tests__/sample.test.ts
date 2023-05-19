import { isLeepYear } from "../sample";

test("2000年は閏年である", () => {
    const result = isLeepYear(2000);
    expect(result).toBe(true);
});

test("2020年は閏年である", () => {
    const result = isLeepYear(2020);
    expect(result).toBe(true);
});

test("2022年は閏年ではない", () => {
    const result = isLeepYear(2022);
    expect(result).toBe(false);
});

test("2100年は閏年ではない", () => {
    const result = isLeepYear(2100);
    expect(result).toBe(false);
});
