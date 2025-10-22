class Photo {
  get photoID() {
    return this._photoID;
  }

  set photoID(value) {
    this._photoID = value;
  }

  get imageURL() {
    return this._imageURL;
  }

  set imageURL(value) {
    this._imageURL = value;
  }

  get photoLikes() {
    return this._photoLikes;
  }

  set photoLikes(value) {
    this._photoLikes = value;
  }

  get description() {
    return this._description;
  }

  set description(value) {
    this._description = value;
  }

  get photoTimestamp() {
    return this._photoTimestamp;
  }

  set photoTimestamp(value) {
    this._photoTimestamp = value;
  }

  get reviewID() {
    return this._reviewID;
  }

  set reviewID(value) {
    this._reviewID = value;
  }

  get summaryID() {
    return this._summaryID;
  }

  set summaryID(value) {
    this._summaryID = value;
  }
  constructor(photoID, imageURL, photoLikes, description, photoTimestamp, reviewID, summaryID) {
    this._photoID = photoID;
    this._imageURL = imageURL;
    this._description = description;
    this._photoTimestamp = photoTimestamp;
    this._reviewID = reviewID;
    this._summaryID = summaryID;
    this._photoLikes = photoLikes;
  }
}
module.exports = Photo;
