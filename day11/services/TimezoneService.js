const fs = require('fs');
const path = require('path');

class TimezoneService {
  constructor() {
    this.cacheStore = {};
  }

  getAvailableTimezones() {
    let availableTimezones;
    if (this.cacheStore.timezones) {
      availableTimezones = this.cacheStore.timezones;
    } else {
      const availableTimezonesContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'timezone.json'), 'utf-8');
      availableTimezones = JSON.parse(availableTimezonesContent);
      this.cacheStore.timezones = availableTimezones;
    }
    return availableTimezones;
  }

  findTimezone(target) {
    const availableTimezones = this.getAvailableTimezones();
    return availableTimezones?.find((timezone) => timezone?.Abbreviation == target);
  }

  validateTimeZone(target) {
    const findTimezone = this.findTimezone(target);
    return !!findTimezone;
  }
}

module.exports = TimezoneService;
