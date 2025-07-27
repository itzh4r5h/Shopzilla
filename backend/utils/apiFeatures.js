const { isOnlyDigits } = require("./helpers")

class ApiFeatures{
    constructor(query,queryString){
        this.query = query
        this.queryString = queryString
    }

    search(){
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        }:{}

        this.query = this.query.find({...keyword})

        return this
    }

    filter(){
        const queryStringCopy = {...this.queryString}

        // remove some fields for category
        const fieldsToBeRemoved = ['keyword','page','limit']

        fieldsToBeRemoved.forEach((key)=>delete queryStringCopy[key])

        // filter for price
        // excluding minPrice and maxPrice from queryStringCopy rest properties saving in restQueryString
        let {minPrice,maxPrice, ...restQueryString} = queryStringCopy
        // if minPrice and maxPrice are defined then add the price proptery else restQueryString remains same
        restQueryString = (minPrice && maxPrice) && (isOnlyDigits(minPrice) && isOnlyDigits(maxPrice)) ? {
            ...restQueryString,
            price: {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            }
        }:{
            ...restQueryString
        }
        

        this.query = this.query.find(restQueryString)

        return this
    }


    pagination(resultPerPage){
        const page = this.queryString.page || 1
        const currentPage = isOnlyDigits(page) ? page : 1

        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeatures