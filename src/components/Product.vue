<template>
    <div id="app">
        <header>
            <h1>Product List</h1>
        </header>
        <main>
            <div class="container">
                <b-button class="mb-2" @click="addModal = true">Add New Product</b-button>
                <table class="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(product,i) in posts" :key="i">
                        <td>{{product.id}}</td>
                        <td>{{product.title}}</td>
                        <td>{{product.description}}</td>
                        <td>{{product.price}}</td>
                        <td><img height="60px" width="60px" :src="product.image"/></td>
                        <td>
                            <b-button class="btn btn-sm btn-primary mr-2" @click="showEditProduct(product,i)">Edit</b-button>
                            <b-button class="btn btn-sm btn-danger" @click="deleteProduct(product.id,i)">Delete</b-button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <!-- add modal-->
                <b-modal
                        id="addProduct"
                        v-model="addModal"
                        title="New Product"
                        ok-title="Save"
                        @ok="addProduct"
                >
                    <div class="mt-1">
                        <b-form-input v-model="newProductData.title" placeholder="title" name="title" id="title"></b-form-input>
                    </div>
                    <div class="mt-1">
                        <b-form-textarea v-model="newProductData.description" placeholder="description" name="description" id="description"></b-form-textarea>
                    </div>
                    <div class="mt-1">
                        <b-form-input v-model="newProductData.price" type="number" placeholder="price" name="price" id="price"></b-form-input>
                    </div>
                    <div class="mt-1">
                        <input type="file" id="file1" ref="file" v-on:change="onChangeFileUpload"/>
                    </div>
                </b-modal>
                <!-- edit modal-->
                <b-modal
                        id="editProduct"
                        v-model="editModal"
                        title="Update Product"
                        ok-title="Save"
                        @ok="updateProduct"
                >
                    <div class="mt-1">
                        <b-form-input v-model="editData.title" placeholder="title" name="title" id="title"></b-form-input>
                    </div>
                    <div class="mt-1">
                        <b-form-textarea v-model="editData.description" placeholder="description" name="description" id="description"></b-form-textarea>
                    </div>
                    <div class="mt-1">
                        <b-form-input v-model="editData.price" type="number" placeholder="price" name="price" id="price"></b-form-input>
                    </div>
                    <div class="mt-1">
                        <img class="mr-2" :src="editData.image" v-model="editData.image" height="60px" width="60px">
                        <input type="file" id="file" ref="file"  v-on:change="onChangeFileUpload"/>
                    </div>

                </b-modal>
            </div>
            <div class="content">

            </div>
        </main>
    </div>

</template>

<script>
    import axios from 'axios'
    export default {
        name: 'app',
        data(){
            return {
                newProductData:{
                    'title':'',
                    'description':'',
                    'price':'',
                    'image': ''
                },
                editData : {
                    'id': '',
                    'title':'',
                    'description':'',
                    'price':'',
                    'image':null
                },
                image:'',
                index:'',
                editModal: false,
                addModal: false,
                posts:null,
                endpoint:'http://127.0.0.1:8000/api/products',
                createProductUrl: 'http://127.0.0.1:8000/api/products',
                updateProductUrl: 'http://127.0.0.1:8000/api/products/',
            }
        },
        created() {
            this.getAllProducts();
        },
        methods:{
            getAllProducts(){
                let token = localStorage.getItem('token');
                axios.get(this.endpoint, { headers: {"Authorization" : `Bearer ${token}`} })
                    .then(response => {
                        this.posts = response.data['products'];
                    })
                    .catch(error => {
                        console.log('error');
                    })

            },
            onChangeFileUpload(e){
                this.editData.image = this.$refs.file.files[0];
                this.newProductData.image = this.$refs.file.files[0];
            },
            async addProduct(){
                let token = localStorage.getItem('token');
                let formdData = new FormData();
                formdData.append('image',this.newProductData.image);
                formdData.append('description',this.newProductData.description);
                formdData.append('title',this.newProductData.title);
                formdData.append('price',this.newProductData.price);

                await axios.post(this.endpoint, formdData, { headers: {"Authorization" : `Bearer ${token}`, "enctype":"multipart/form-data"} })
                    .then(response => {
                        this.posts.unshift(response.data['product']);
                        // this.s('Product Added Successfully');
                        // this.addModal = false;
                        for(var key in this.newProductData){
                            this.newProductData[key]='';
                        }
                    })
                    .catch(error => {
                        console.log('error');
                    })
            },
            updateProduct(){
                let token = localStorage.getItem('token');
                let updateUrl = this.updateProductUrl + this.editData.id;
                let formdData = new FormData();
                formdData.append('image',this.editData.image);
                formdData.append('id',this.editData.id);
                formdData.append('description',this.editData.description);
                formdData.append('title',this.editData.title);
                formdData.append('price',this.editData.price);

                axios.post(updateUrl, formdData, { headers: {"Authorization" : `Bearer ${token}`,  "enctype":"multipart/form-data"} })
                    .then(response => {
                        this.posts[this.index].title = response.data['product'].title;
                        this.posts[this.index].price = response.data['product'].price;
                        this.posts[this.index].description = response.data['product'].description;
                        this.posts[this.index].image = response.data['product'].image;
                        // this.s('Product Added Successfully');
                        // this.addModal = false;
                        for(var key in this.newProductData){
                            this.newProductData[key]='';
                        }
                    })
                    .catch(error => {
                        console.log('error');
                    })
            },
            
            deleteProduct(id,index){
                if(confirm("Do you really want to delete?")){
                    let token = localStorage.getItem('token');
                    let updateUrl = this.updateProductUrl + id;
                    axios.delete(updateUrl, { headers: {"Authorization" : `Bearer ${token}`} })
                        .then(response => {
                            this.posts.splice(index,1);
                        })
                        .catch(error => {
                            console.log('error');
                        })
                }
            },

            showEditProduct(product, index){
                let Obj = {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price :product.price,
                    image :product.image,
                }
                this.editData = Obj;
                this.editModal = true;
                this.index = index;
            },

        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }


</style>

