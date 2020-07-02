<template>
	<div class="opencv">
		<h2>Hello OpenCV.js</h2>
    <button @click="toggleStream">{{!!video.srcObject}}</button>
		<div>
			<div class="inputoutput">
				<video className="video" playsInline ref="myVideo" width=videoSize height=videoSize />
			</div>
			<div class="inputoutput">
				<canvas ref="canvasOutput" id="canvasOutput" v-bind:width="videoSize" v-bind:height="videoSize"></canvas>
        <div>
          <button class="caption" @click="snapGrayScale">snapGrayScale </button>
        </div>
			</div>
		</div>
	</div>
</template>

<script>
import cv from "../../services/cv";

export default {
	name: "OpenCV",
	data() {
		return {
      previewImage:null,
      canvas:{},
      video:{},
      videoSize: 500,
    };
  },
  beforeCreate(){
    cv.load();
  },
  mounted(){
    let c = this.$refs.canvasOutput;
    this.canvas = c.getContext('2d');
    
    this.streamWebCam();

  },
  methods:{
    async snapGrayScale(){
      this.canvas.drawImage(this.video, 0, 0);
      let imgData = this.canvas.getImageData(0, 0, this.videoSize, this.videoSize)
      
      const processedImage = await cv.canvasDisplay({
        previewImage: imgData
      });
      this.canvas.putImageData(processedImage.data.payload, 0, 0);
    },
    toggleStream(){
      if(this.video.srcObject){
        this.video.srcObject = null;
        //console.log(this.video);
      }else{
        this.streamWebCam()
      }
      console.log(!!this.video.srcObject)
    },
    streamWebCam(){
      this.video = this.$refs.myVideo;
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: {width: this.videoSize, height: this.videoSize} }).then(stream => {
              this.video.srcObject = stream;
              this.video.play();
          });
      }
    }
  }
};
</script>