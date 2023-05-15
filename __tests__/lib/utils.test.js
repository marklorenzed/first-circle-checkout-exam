import { Checkout, PricingRules } from '@/lib/utils';
import myData from './../../src/app/items.json';

describe('Checkout with pricing rules', () => {
    test(' if you buy less than 3 Apple TVs, you will pay for regular price of $109.5 each', () => {
        const myPricingRules = new PricingRules
        const co = new Checkout(myPricingRules);

        co.scan(myData.atv);
        co.scan(myData.atv);

        expect(co.total()).toBe("219.00"); 
    });
    test(' if you buy 3 Apple TVs, you will pay the price of 2 only', () => {
        const myPricingRules = new PricingRules
        const co = new Checkout(myPricingRules);

        co.scan(myData.atv);
        co.scan(myData.atv);
        co.scan(myData.atv);

        expect(co.total()).toBe("219.00"); 
    });

    test('Price of Super Ipad is $549.99 each if not more than 4 items', () => {
        const myPricingRules = new PricingRules
        const co = new Checkout(myPricingRules);

        co.scan(myData.ipd);
        co.scan(myData.ipd);
        co.scan(myData.ipd);
        co.scan(myData.ipd);

        expect(co.total()).toBe("2199.96"); 
    });

    test('Price of Super Ipad is $499.99 each if more than 4 items', () => {
        const myPricingRules = new PricingRules
        const co = new Checkout(myPricingRules);

        co.scan(myData.ipd);
        co.scan(myData.ipd);
        co.scan(myData.ipd);
        co.scan(myData.ipd);
        co.scan(myData.ipd);

        expect(co.total()).toBe("2499.95"); 
    });

    test('Free VGA adapter for every Macbook PRO purchase', () => {
        const myPricingRules = new PricingRules
        const co = new Checkout(myPricingRules);

        co.scan(myData.mbp);
        co.scan(myData.vga);

        expect(co.total()).toBe("1399.99"); 
    });
    test('Free VGA adapter for every Macbook PRO purchase, extra vga is charged', () => {
        const myPricingRules = new PricingRules
        const co = new Checkout(myPricingRules);

        co.scan(myData.mbp);
        co.scan(myData.vga);
        co.scan(myData.vga);

        expect(co.total()).toBe("1429.99"); 
    });
  });