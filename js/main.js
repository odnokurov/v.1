Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            default: () => []
        }
    },
    template: `
    <ul class="product-details-list">
      <li v-for="(detail, index) in details" :key="index">
        {{ detail }}
      </li>
    </ul>
  `
});
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">

        <div class="product-image">
            <img v-bind:src="image" v-bind:alt="altText" />
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <span>{{sale}}</span>
            <span v-else></span>
            <p>{{ description }}</p>
            <p v-if="inventory > 10">In stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else-if="!inStock" :class="{nostock: !inStock}">Out of stock</p>
            <p v-else>Out of stock</p>
            <product-details :details="details"></product-details>
            <p>Shipping is {{ shipping }}</p>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            ></div>
            <ul>
                <li v-for="size in sizes">{{ size }}</li>
            </ul>
            <a v-bind:href="link">More products like this</a><br>
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>
            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
    </div> `,
    data() { return {
        product: "Socks",
        brand: 'Vue Mastery',
        description: "A pair of warm, fuzzy socks",
        selectedVariant: 0,
        altText: "A pair of socks",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inStock: true,
        inventory: 10,
        onSale: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }
        ],

        sizes: ['32-34', '36-38', '40-42', '44-46', '48-50', '52-54'],
        cart: 0,

    }},
    methods: {
        addToCart() {
            this.cart += 1
            if (this.cart > this.inventory) {
                this.cart = this.inventory
            }
        },
        removeFromCart() {
            this.cart -= 1;
            if (this.cart < 0) {
                this.cart = 0;
            }
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }

    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale(){
            if (this.onSale === true)
            return this.brand + ' sells ' + this.product + ' with 50% discount!';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    },
})
let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})
