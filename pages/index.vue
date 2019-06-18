<template lang="pug">
  div
    h3(v-if="isUpLoaded") 写真がアップロードされました!
    h3(v-else) 写真をアップロードしてください
    img(:src="imagePath")
    input(type="file" id="inputFile" @change="uploadImage")
    button(type="button" @click="getImagePredict" :disabled="isUploading" v-if="imagePath") 生成
    div
      div(v-for="c in colors" :style="{'background': c.raw_hex}").ball
        p(v-if="c.raw_hex!=='#ffffff'") {{c.raw_hex}}
        p.white(v-else) {{c.raw_hex}}
</template>

<script>
import firebase from '~/plugins/firebase.js';
const Clarifai=require('clarifai');
const app=new Clarifai.App({
  apiKey: 'b68f51ad735148e78c14a364e4d2e084'
})

let imgDlUrl=''
export default {
  data(){
    return {
      imagePath: '',
      isUploading: false,
      isUpLoaded: false,
      isImgDownloading: false,
      colors: []
    }
  },
  methods:{
    uploadImage:function(){
      const files=event.target.files
      if(files.length>=1){
        const reader=new FileReader()
        reader.onload=(e)=>{
          this.imagePath=e.target.result
        }
        reader.readAsDataURL(files[0])
        this.imagePath=files[0].name
        const storageRef=firebase.storage().ref(files[0].name);
        storageRef.put(files[0]).then(function(snapshot){
          console.log('image is uploaded!')
          firebase.storage().ref(files[0].name).getDownloadURL().then(function(url){
            imgDlUrl=url
            console.log(`image url is ${url}`)
          })
        })
        this.isUpLoaded=true
      }
    },
    getImagePredict:function(){
      app.models.predict(Clarifai.COLOR_MODEL,imgDlUrl).then(res=>{
        console.log(res)
        this.colors=res.outputs[0].data.colors
      },error=>{
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
img{
  height: 250px;
  width: auto;
}
.ball{
  height: 100px;
  width: 100px;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  p{
    text-align: center;
    position: absolute;
    width: 80px;
    height: 20px;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
  }
  .white{
    color: white;
  }
}
</style>
