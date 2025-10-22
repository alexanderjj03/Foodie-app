class ReviewsDish {
  get reviewID() {
    return this._reviewID;
  }

  set reviewID(value) {
    this._reviewID = value;
  }

  get dishName() {
    return this._dishName;
  }

  set dishName(value) {
    this._dishName = value;
  }

  get dishRating() {
    return this._dishRating;
  }

  set dishRating(value) {
    this._dishRating = value;
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
  constructor(reviewID, dishName, dishRating, foodLocationName, address, postalCode, country) {
    this._reviewID = reviewID;
    this._dishName = dishName;
    this._dishRating = dishRating;
    this._foodLocationName = foodLocationName;
    this._address = address;
    this._postalCode = postalCode;
    this._country = country;
  }
}
module.exports = ReviewsDish;
