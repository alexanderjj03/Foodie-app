class Vote {
  get voteID() {
    return this._voteID;
  }

  set voteID(value) {
    this._voteID = value;
  }

  get userID() {
    return this._userID;
  }

  set userID(value) {
    this._userID = value;
  }

  get photoID() {
    return this._photoID;
  }

  set photoID(value) {
    this._photoID = value;
  }

  get commentID() {
    return this._commentID;
  }

  set commentID(value) {
    this._commentID = value;
  }

  constructor(voteID, userID, photoID, commentID) {
    this._voteID = voteID;
    this._userID = userID;
    this._photoID = photoID;
    this._commentID = commentID;
  }
}
module.exports = Vote;
