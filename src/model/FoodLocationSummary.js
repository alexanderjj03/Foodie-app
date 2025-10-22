class FoodLocationSummary {
  get summaryID() {
    return this._summaryID;
  }

  set summaryID(value) {
    this._summaryID = value;
  }

  get averageRating() {
    return this._averageRating;
  }

  set averageRating(value) {
    this._averageRating = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
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
  constructor(
    summaryID,
    averageRating,
    description,
    foodLocationName,
    address,
    postalCode,
    country
  ) {
    this._summaryID = summaryID;
    this._averageRating = averageRating;
    this._description = description;
    this._foodLocationName = foodLocationName;
    this._address = address;
    this._postalCode = postalCode;
    this._country = country;
  }
}
module.exports = FoodLocationSummary;
