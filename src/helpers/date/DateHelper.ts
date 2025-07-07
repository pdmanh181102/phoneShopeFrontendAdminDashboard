export default class DateHelper {
  static StringToDate(date: string | undefined) {
    if (date == undefined) return "N/A";
    return new Date(date).toLocaleDateString("vi-VN");
  }
}
