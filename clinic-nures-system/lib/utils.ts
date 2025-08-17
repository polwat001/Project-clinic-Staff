// ฟังก์ชันรวมคลาสเนมแบบง่าย
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
