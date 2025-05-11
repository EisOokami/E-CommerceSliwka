export default {
    async beforeCreate(event) {
        const data = event.params.data;
  
        if (data.isDiscount) {
            data.finalPrice = data.discountedPrice;
        } else {
            data.finalPrice = data.price;
        }
    },
};
  