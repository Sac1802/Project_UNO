class Either {
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  static right(value) {
    return new Either(null, value);
  }

  static left(value) {
    return new Either(value, null);
  }

  isRight() {
    return this.right !== null;
  }

  map(fn) {
    return this.isRight() ? Either.right(fn(this.right)) : this;
  }

  flatMap(fn) {
    return this.isRight() ? fn(this.right) : this;
  }

  getOrElse(defaultValue) {
    return this.isRight() ? this.right : defaultValue;
  }

  getError() {
    return this.left;
  }
}

export default Either;
