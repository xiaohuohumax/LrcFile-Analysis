/**
 * 时间步进值
 */
export const TIME_STEEP = [360_0000, 6_0000, 1000, 1];

/**
 * 时间步进计算
 * 
 * 例如:
 * ```
 * times => ['01','02','03','04']
 * 
 * return => times[0] * TIME_STEEP[0] + (...)
 * ```
 * @param times 时间 
 * @returns 总时间
 * 
 * @see {TIME_STEEP} 时间步进
 */
export function timeCount(times: string[]): number {
  return TIME_STEEP
    .map((steep, index) => parseInt(times[index]) * steep || 0)
    .reduce((x, y) => x + y);
}