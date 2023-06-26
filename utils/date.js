export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getFormattedTime(date) {
  const hours =
    date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
  return hours + " : " + minutes;
}

export function getDayName(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
}

export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}

export function getNextDaySameTime(date) {
    const Tomorrow = new Date(date.getFullYear(), date.getMonth(),date.getDate() + 1);
    Tomorrow.setHours(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return Tomorrow;
}

export function getMondayOfWeek(date) {
    let newDate = new Date(date);
    const day = newDate.getDay();
    const diff = newDate.getDate() - day + (day === 0 ? -6 : 1); // to handle Sunday
    newDate.setDate(diff);

    // Reset time to 00:00.
    newDate.setHours(0, 0, 0, 0);

    return newDate;
}

export function getSundayOfWeek(date) {
    let newDate = new Date(date);
    const day = newDate.getDay();
    const diff = 7 - day;
    newDate.setDate(newDate.getDate() + diff);

    // Reset time to 23:59:59:99.
    newDate.setHours(23, 59, 59, 99);

    return newDate;
}


export function getDuration(startTime, endTime) {
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.round((diff / (1000 * 60)) % 60);

    const hourString = hours > 1 ? "hours" : "hour";
    const minuteString = minutes > 1 ? "minutes" : "minute";

    return `${hours} ${hourString} ${minutes} ${minuteString}`;
}
export function onSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );

}
