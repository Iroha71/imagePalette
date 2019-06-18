<template lang="pug">
  div
    h3#desc 写真をアップロードしてください
    img(:src="imagePath")
    br
    input(type="file" id="inputFile" @change="uploadImage")
    button#makePalette(type="button" @click="getImagePredict" :disabled="isUploading" v-if="imagePath" disabled) パレット作成
    p#paletteDesc
    div(v-for="c in colors")
      div(:style="{'background': c.raw_hex}").ball
      p {{c.raw_hex}}
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
      const desc=document.getElementById('desc')
      desc.textContent="アップロード中です、お待ちください"
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
          firebase.storage().ref(files[0].name).getDownloadURL().then(function(url){
            imgDlUrl=url
            desc.textContent="画像がアップロードされました！「パレット作成」ボタンを押してください"
            const makePalette=document.getElementById('makePalette')
            makePalette.disabled=""
            console.log(`image url is ${url}`)
          })
        })
        this.isUpLoaded=true
      }
    },
    getImagePredict:function(){
      desc.textContent="画像をアップロードしてください"
      makePalette.disabled="disabled"
      paletteDesc.textContent="作成中です・・・"
      app.models.predict(Clarifai.COLOR_MODEL,imgDlUrl).then(res=>{
        console.log(res)
        this.colors=res.outputs[0].data.colors
        paletteDesc.textContent="パレットを作成しました！"
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
div{
  display: inline-block;
  .ball{
    height: 100px;
    width: 100px;
    border-radius: 50%;
    position: relative;
    p{
      text-align: center;
      width: 80px;
      height: 20px;
    } 
  }
}
</style>
