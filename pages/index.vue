<template lang="pug">
  div
    h3 写真をアップロードしてください
    img(:src="imagePath")
    input(type="file" id="inputFile" @change="uploadImage")
    button(type="button" @click="getImagePredict") 生成
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
      isImgDownloading: false
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
      }
    },
    getImagePredict:function(){
      app.models.predict(Clarifai.COLOR_MODEL,imgDlUrl).then(res=>{
        console.log(res)
      },error=>{
        console.log(error)
      })
    }
  }
}
</script>

