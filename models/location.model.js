const Location = function (location) {
    this.address = location.address;
    this.city_id = location.city;
    this.zip_code = location.zipCode;
}

module.exports = Location