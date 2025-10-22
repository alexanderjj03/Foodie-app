class Dish {
  get dishName() {
    return this._dishName;
  }

  set dishName(value) {
    this._dishName = value;
  }

  get price() {
    return this._price;
  }

  set price(value) {
    this._price = value;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get isHalal() {
    return this._isHalal;
  }

  set isHalal(value) {
    this._isHalal = value;
  }

  get isGlutenFree() {
    return this._isGlutenFree;
  }

  set isGlutenFree(value) {
    this._isGlutenFree = value;
  }

  get isVegetarian() {
    return this._isVegetarian;
  }

  set isVegetarian(value) {
    this._isVegetarian = value;
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
    dishName,
    price,
    type,
    isHalal,
    isGlutenFree,
    isVegetarian,
    foodLocationName,
    address,
    postalCode,
    country
  ) {
    this._dishName = dishName;
    this._price = price;
    this._type = type;
    this._isHalal = isHalal;
    this._isGlutenFree = isGlutenFree;
    this._isVegetarian = isVegetarian;
    this._foodLocationName = foodLocationName;
    this._address = address;
    this._postalCode = postalCode;
    this._country = country;
  }
}
module.exports = Dish;
