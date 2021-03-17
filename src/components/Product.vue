<template>
    <div id="app">
        <header>
            <h1>Product List</h1>
        </header>
        <main>
            <div class="container">
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
                        
                        </td>
                    </tr>
                    </tbody>
                </table>
                
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

