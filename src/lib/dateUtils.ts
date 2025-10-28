/**
 * ローカル日付を "yyyy-MM-dd" に変換（タイムゾーン補正なし）
 * Date オブジェクトの年・月・日を直接取得して文字列化することで、
 * タイムゾーンの影響を受けずに正確な日付文字列を生成します。
 */
export const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * Supabase の DATE カラムは補正不要。timestamp の場合も日付部分だけ使用
 */
export const normalizeDateString = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return value.split("T")[0];
};
