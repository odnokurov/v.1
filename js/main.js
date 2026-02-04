Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
        }
    },
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
       </div>
     </div>
 `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

let eventBus = new Vue({
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
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
Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">

    <p v-if="errors.length">
     <b>Please correct the following error(s):</b>
     <ul>
       <li v-for="error in errors">{{ error }}</li>
     </ul>
    </p>
    
     <p>
       <label for="name">Name:</label>
       <input id="name" v-model="name" placeholder="name">
     </p>
    <p>
        Would you recommend this product?
        <div>
            <input type="radio" id="yes" name="yes" value="yes">
            <label for="yes">Yes</label>
        </div>
        <div>
            <input type="radio" id="no" name="no" value="no">
            <label for="no">No</label>
        </div>
    </p>
     <p>
       <label for="review">Review:</label>
       <textarea id="review" v-model="review"></textarea>
     </p>
    
     <p>
       <label for="rating">Rating:</label>
       <select id="rating" v-model.number="rating">
         <option>5</option>
         <option>4</option>
         <option>3</option>
         <option>2</option>
         <option>1</option>
       </select>
     </p>
    
     <p>
       <input type="submit" value="Submit"> 
     </p>
    
    </form>

 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
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
           <button
                   v-on:click="addToCart"
                   :disabled="!inStock"
                   :class="{ disabledButton: !inStock }"
           >
               Add to cart
           </button>
            <button v-on:click="removeFromCart">-</button>
        </div>
        <product-tabs :reviews="$root.reviews"></product-tabs>
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
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
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
        premium: true,
        cart: [],
        reviews: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        updateRemove(id) {
            this.cart.pop(id);
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        },
    }
})