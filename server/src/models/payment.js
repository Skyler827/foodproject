let mongoose   = require("mongoose");
let Schema     = mongoose.Schema;
let ForeignKey = Schema.Types.ObjectId;

let payment = new Schema({
    order: {
        type: ForeignKey,
        ref: 'order',
        required: true
    },
    amountCents: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['cash', 'credit_card', 'gift_card'],
        required: true
    },
    card_data: {
        card_number: {
            type: Number,
            required: false
        },
        auth_code: {
            type: String,
            required: false
        }
    }
});

payment.path('card_data.card_number').validate(function(card_number) {
    if (this.type == 'credit_card' && card_number == null) {
        return false;
    } else return true;
}, 'must contain card data if payment is a credit card');

Payment = mongoose.model("payment", payment);
