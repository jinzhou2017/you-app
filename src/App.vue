<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <form action="/file_upload" method="post" enctype="multipart/form-data">
      <input type="file" name="image" size="50" />
      <br />
      <input type="submit" value="上传文件" />
       <p>3333---------------</p>
    </form>
    <pre>{{ssss}}</pre>
    <input type="text" v-model="input" />
    <p>{{input}}</p>
    <p>数据</p>
    <p>{{msg}}----------------</p>
    <ul style="list-style: none; width: 500px;margin: 0 auto;">
      <li v-for="(item, index) in movies" :key="index">
        <p>{{item.title}}</p>
        <img :src="item.images.small" alt="">
      </li>
    </ul>
    <video src="movie.ogg" controls="controls">
      您的浏览器不支持 video 标签。
    </video>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'app',
  data () {
    return {
       movies: [],
        msg: '',
      ws:'',
      input:'',
      ssss: '<div></div>'
    }
  },
  created () {
    this.getNewMovies()

  },
  watch: {
    input(val) {
      this.ws.send(val)
    }
  },
    methods: {
        getNewMovies () {
          axios.get('https://api.douban.com/v2/movie/in_theaters')
            .then((res) => {
              let { subjects } = res.data
              this.movies.push(...subjects)
            })
        }
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
</style>
