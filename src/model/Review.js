class Review {
  get reviewID() {
    return this._reviewID;
  }

  set reviewID(value) {
    this._reviewID = value;
  }

  get overallRating() {
    return this._overallRating;
  }

  set overallRating(value) {
    this._overallRating = value;
  }

  get serviceRating() {
    return this._serviceRating;
  }

  set serviceRating(value) {
    this._serviceRating = value;
  }

  get waitTimeRating() {
    return this._waitTimeRating;
  }

  set waitTimeRating(value) {
    this._waitTimeRating = value;
  }

  get reviewTimeStamp() {
    return this._reviewTimeStamp;
  }

  set reviewTimeStamp(value) {
    this._reviewTimeStamp = value;
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

  get userID() {
    return this._userID;
  }

  set userID(value) {
    this._userID = value;
  }
  constructor(
    reviewID,
    overallRating,
    serviceRating,
    waitTimeRating,
    reviewTimeStamp,
    foodLocationName,
    address,
    postalCode,
    country,
    userID
  ) {
    this._reviewID = reviewID;
    this._overallRating = overallRating;
    this._serviceRating = serviceRating;
    this._waitTimeRating = waitTimeRating;
    this._reviewTimeStamp = reviewTimeStamp;
    this._foodLocationName = foodLocationName;
    this._address = address;
    this._postalCode = postalCode;
    this._country = country;
    this._userID = userID;
  }
}
module.exports = Review;
