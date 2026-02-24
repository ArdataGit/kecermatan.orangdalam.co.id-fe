import moment from 'moment';
import 'moment/locale/id';

/**
 * Formats a date string with Indonesian timezone abbreviations (WIB, WITA, WIT)
 * based on the user's GMT offset.
 * 
 * @param date The date to format
 * @param formatStr Moment format string (default: 'DD/MM/YYYY HH:mm')
 * @param locale Locale string (default: 'id')
 * @returns Formatted date string with timezone abbreviation
 */
export const formatDateWithTimezone = (
  date: string | Date | number,
  formatStr: string = 'DD/MM/YYYY HH:mm',
  locale: string = 'id'
): string => {
  const m = moment(date).locale(locale);
  if (!m.isValid()) return '-';

  const offset = m.utcOffset() / 60; // Offset in hours
  
  let tzAbbr = '';
  if (offset === 7) {
    tzAbbr = 'WIB';
  } else if (offset === 8) {
    tzAbbr = 'WITA';
  } else if (offset === 9) {
    tzAbbr = 'WIT';
  } else {
    // Fallback for other offsets if necessary, or just show GMT+X
    tzAbbr = `GMT${offset >= 0 ? '+' : ''}${offset}`;
  }

  return `${m.format(formatStr)} ${tzAbbr}`;
};
