/**
 * Simple Pricing Rules
 * @constructor
 */
export function PricingRules() {
    this.applyPricingRule = function(items, isIndividual) {
        let sum = 0;
        let individualSum = {};
        let skus = [];
        let atvCount = 0;
        let mbpCount = 0;
        let ipdCount = 0;
        let vgaCount = 0;

        for (let i=0; i < items.length ;i++){
            skus.push(items[i].id);

            if (!individualSum[items[i].id]) {
                individualSum[items[i].id] = 0;
            }

            // 3-for-2 deal on Apple TVs
            if (items[i].id == 'atv'){
                atvCount++;
                if (atvCount == 3){
                    atvCount = 0; // clear counter
                    continue; //  Skip the 3rd atv
                }
            }

            // the brand new Super iPad will have a bulk discount applied, where the price will drop to $499.99 each if someone buys more than 4
            if (items[i].id == 'ipd') {
                ipdCount++;

                if (ipdCount == 4){
                    console.log(' the brand new Super iPad will have a bulk discount applied, where the price will drop to $499.99 each if someone buys more than 4' );

                    individualSum[items[i].id] -=200;
                    sum-=200; // Apply $50 discount on each 4 ipd

                // Succeeding ipd to have a $0 discount
                } else if (ipdCount >= 4) {
                    console.log('the brand new Super iPad will have a bulk discount applied, where the price will drop to $499.99 each if someone buys more than 4' );
                    
                    sum += (items[i].price-50);
                    individualSum[items[i].id] += (items[i].price-50);
                    continue;
                }
            }

            if (items[i].id == 'vga') {
                vgaCount++
            }

            if (items[i].id == 'mbp') {
                mbpCount++
            }
           
            individualSum[items[i].id] += items[i].price;
            sum += items[i].price;
        }

        if (vgaCount && mbpCount) {
            const diff = mbpCount - vgaCount;
            console.log(mbpCount, vgaCount)
            if (diff === 0) {
                individualSum.vga = 0;
                sum -= mbpCount* 30
            } else if (diff > 0) {
                individualSum.vga = 0;
                sum -= diff * 30;
            } else if (diff < 0) {
                individualSum.vga -= mbpCount*30;
                sum -= mbpCount*30;
            }
        }

        if (isIndividual) {
            return individualSum;
        }

        return sum.toFixed(2);
    }
};


/**
 * Checkout
 * @param priceRules
 * @constructor
 */
export function Checkout(priceRules) {
    this.items = [];
    this.pricingRules = priceRules;

    this.scan = function(item) {
        this.items.push(item);
    };

    // Total price of the items without Price Rules
    this.sumTotal = function() {
        var sum = 0;
        this.items.forEach(function(value, index){
            sum += value.price;
        });
        return sum;
    };

    // Total price of the items WITH Price Rules
    this.total = function() {
        return this.pricingRules.applyPricingRule(this.items);
    }

    this.totalPerItem = function() {
        return this.pricingRules.applyPricingRule(this.items, true);
    }
};