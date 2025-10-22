class LimitedTimeDish {
  get dishName() {
    return this._dishName;
  }

  set dishName(value) {
    this._dishName = value;
  }

  get foodLocationName() {
    return this._foodLocationName;
  }

  set foodLocationName(value) {
    this._foodLocationName = value;
  }

  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  get postalCode() {
    return this._postalCode;
  }

  set postalCode(value) {
    this._postalCode = value;
  }

  get country() {
    return this._country;
  }

  set country(value) {
    this._country = value;
  }

  get startDate() {
    return this._startDate;
  }

  set startDate(value) {
    this._startDate = value;
  }

  get endDate() {
    return this._endDate;
  }

  set endDate(value) {
    this._endDate = value;
  }
  constructor(dishName, foodLocationName, address, postalCode, country, startDate, endDate) {
    this._dishName = dishName;
    this._foodLocationName = foodLocationName;
    this._address = address;
    this._postalCode = postalCode;
    this._country = country;
    this._startDate = startDate;
    this._endDate = endDate;
  }
}
module.exports = LimitedTimeDish;
