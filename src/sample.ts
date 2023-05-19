/**
 * 閏年を判定する関数
 *
 * @param year
 * @returns 閏年かどうか
 */
export function isLeepYear(year: number): boolean {
    if (year % 4 === 0) {
        if (year % 400 === 0) {
            // 400の倍数ならば閏年
            return true;
        }
        if (year % 100 === 0) {
            // 400の倍数ではなく100の倍数ならば閏年でない
            return false;
        }
        return true;
    }
    // 4の倍数でなければ閏年ではない
    return false;
}