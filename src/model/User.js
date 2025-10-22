class User {
  get firstName() {
    return this._firstName;
  }

  set firstName(value) {
    this._firstName = value;
  }

  get lastName() {
    return this._lastName;
  }

  set lastName(value) {
    this._lastName = value;
  }
  constructor(userID, firstName, lastName, email, password, numReviews) {
    this._userID = userID;
    this._firstName = firstName;
    this._lastName = lastName;
    this._email = email;
    this._password = password;
    this._numReviews = numReviews;
    this._firstName = firstName;
  }

  get userID() {
    return this._userID;
  }

  set userID(value) {
    this._userID = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }

  get password() {
    return this._password;
  }

  set password(value) {
    this._password = value;
  }

  get numReviews() {
    return this._numReviews;
  }

  set numReviews(value) {
    this._numReviews = value;
  }
}
module.exports = User;
