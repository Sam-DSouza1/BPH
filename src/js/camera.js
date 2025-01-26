import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
import { detect, detectVideo } from "./utils/detect";

const modelName = "yolov8n";
let model = null;

const msg = new SpeechSynthesisUtterance();
// msg.rate = 1.5;

async function load() {
    const yolov8 = await tf.loadGraphModel(
      `${modelName}_web_model/model.json`,
      {
        onProgress: (fractions) => {
        },
      }
    ); // load model

    // warming up model
    const dummyInput = tf.ones(yolov8.inputs[0].shape);
    const warmupResults = yolov8.execute(dummyInput);

    // setLoading({ loading: false, progress: 1 });
    model = {
      net: yolov8,
      inputShape: yolov8.inputs[0].shape,
    }; // set model & input shape

    tf.dispose([warmupResults, dummyInput]); // cleanup memory
  };
load();

(() => {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    const width = window.innerWidth; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    let streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    let video = null;
    let canvas = null;
    let startButton = null;
  
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".content-area").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    }
  
    function startup() {
      if (showViewLiveResultButton()) {
        return;
      }
      video = document.getElementById("video");
      canvas = document.getElementById("canvas");
      startButton = document.getElementById("start-button");
  
      navigator.mediaDevices
        .getUserMedia({ 
          video: true,
          audio: false,
          video: {facingMode: { ideal: 'environment' },
        }, })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
  
      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
  
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
  
            if (isNaN(height)) {
              height = width / (4 / 3);
            }
  
            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
          }
        },
        false,
      );
      
      let lastTime = null;
      let mousedown = false;
      document.getElementById("tap-area").addEventListener("mousedown", () => {
        mousedown = true;
        press();
      });
      document.getElementById("tap-area").addEventListener("touchstart", () => {
        mousedown = true;
        press();
      });
      // double click to toggle continuous feedback, but single click to toggle off
      // document.getElementById("tap-area").addEventListener("dblclick", () => {
      //   mousedown = !mousedown;
      //   if (mousedown) {
      //     press();
      //   }
      //   else {
      //     lastTime = null;
      //   }
      // });
      
      async function press() {
        // while(mousedown) {
          // const timeElapsed = Date.now() - lastTime;
          // if(lastTime == null || timeElapsed > 8000) {
            takePicture();
            // lastTime = Date.now();
          // }
          // await new Promise(r => setTimeout(r, 1000));
        // }
      }

      document.getElementById("tap-area").addEventListener("mouseup", () => {
        mousedown = false;
      })
      document.getElementById("tap-area").addEventListener("touchend", () => {
        mousedown = false;
      })
  
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    async function takePicture() {
      const context = canvas.getContext("2d");
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
   
        const data = canvas.toDataURL("image/jpeg"); // Convert to JPEG format
        const rawBase64Data = data.split(",")[1]; // Extract the Base64 portion
        // var msg = new SpeechSynthesisUtterance();

        // msg.text = "Hello World";
        // window.speechSynthesis.speak(msg);
   
        try {
          const response = await respond(rawBase64Data); // Call respond with Base64 image
          console.log("AI Response:", response); // Log AI response
          // Speak the response out loud
          // const msg = new SpeechSynthesisUtterance();
          // msg.rate = 1.5;
          msg.text = response;
          window.speechSynthesis.speak(msg);          
        } catch (error) {
          // const msg = new SpeechSynthesisUtterance();
          // msg.rate = 1.5;
          msg.text = "Error fetching response";
          window.speechSynthesis.speak(msg); 
          console.error("Error in respond function:", error);
        }
   
      }
    }
    
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener("load", startup, false);
  })();

let videoOpen = false;
const videoStreamElement = document.getElementById("video-stream");
  document.getElementById("video-stream-checkbox").addEventListener("click", () => {

  videoStreamElement.classList.toggle("hidden");
  if(videoOpen) {
    // closeVideo()
  } else {
    detectVideo(video, model, canvas);
    videoOpen = true;
  }
});