const { isOnlyDigits } = require("./helpers");

class UserSearch {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = {};
    if (this.queryString.keyword) {
      if (this.queryString.keyword.includes("@")) {
        keyword.email = this.queryString.keyword;
      } else {
        keyword.name = {
          $regex: this.queryString.keyword,
          $options: "i",
        };
      }
    }

    this.query = this.query.find({ ...keyword }).select(
    "-password -otp -otpExpire -resetPasswordToken -resetPasswordTokenExpire -emailVerificationToken -emailVerificationTokenExpire"
  );

    return this;
  }

  pagination(resultPerPage) {
    const page = this.queryString.page || 1;
    const currentPage = isOnlyDigits(page) ? page : 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = UserSearch;
