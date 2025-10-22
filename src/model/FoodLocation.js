class FoodLocation {
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

  get totalScore() {
    return this._totalScore;
  }

  set totalScore(value) {
    this._totalScore = value;
  }

  get numReviews() {
    return this._numReviews;
  }

  set numReviews(value) {
    this._numReviews = value;
  }

  get city() {
    return this._city;
  }

  set city(value) {
    this._city = value;
  }

  get genre() {
    return this._genre;
  }

  set genre(value) {
    this._genre = value;
  }

  get summaryID() {
    return this._summaryID;
  }

  set summaryID(value) {
    this._summaryID = value;
  }
  constructor(
    foodLocationName,
    address,
    postalCode,
    country,
    totalScore,
    numReviews,
    city,
    genre,
    summaryID
  ) {
    this._foodLocationName = foodLocationName;
    this._address = address;
    this._postalCode = postalCode;
    this._country = country;
    this._totalScore = totalScore;
    this._numReviews = numReviews;
    this._city = city;
    this._genre = genre;
    this._summaryID = summaryID;
  }
}
module.exports = FoodLocation;
