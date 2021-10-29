var interfaceApp = (function(){
    var DrawingHands = (function(){
        /**
         * @param {HTMLMediaElement} videoElement html element
         * 
         */
        function DrawingHands(videoElement){
            this.videoElement = videoElement
            this.model
            this.predictions
        }

        DrawingHands.prototype.load = async function(){
            this.model = await handpose.load()
            // console.log(tf.getBackend());
            // tf.setBackend('webgl');
            // const a = tf.tensor([[1, 2], [3, 4]]);
            // a.dispose();
            //https://www.tensorflow.org/js/guide/platform_environment
        }


        DrawingHands.prototype.ready = async function(){
            this.predictions = await this.model.estimateHands(this.videoElement)
            return console.log('hands ready!')
        }

        DrawingHands.prototype.drawPoint = function(){
            this.ready()
            var predictions = this.predictions
            if (predictions && predictions.length > 0) {
                var keypoints = predictions[0].landmarks
                var point = keypoints.filter(array => array.pop())

                return point
            }else{
                return 0
            }
        }

        return DrawingHands
    })()

    var DrawingCanvas = (function(){

        /**
         * 
         * @param {string} canvas htmlelement id
         */
        function DrawingCanvas(canvas){
            this.canvas = new fabric.Canvas(canvas, {

            })
        }

        DrawingCanvas.prototype.draw = function(x, y, r, color){
            var circle = new fabric.Circle({
                left: x, 
                top: y,
                radius: r,
                fill: color
            })

            this.canvas.add(circle)
        }

        DrawingCanvas.prototype.eraizer = function(){

        }

        DrawingCanvas.prototype.reset = function(){

        }

        DrawingCanvas.prototype.setSize = function(element, width, height){

            switch(element? true : false){
                case true:
                    // console.log(this.canvas)
                    this.canvas.setDimensions({ width: element.offsetWidth, height: element.offsetHeight })
                break
                case false:
                    this.canvas.setDimensions({ width: width, height: height })
                break
            }
        }

        //setZoom


        return DrawingCanvas
    })()

    var WavesurferControl = (function(){
        function WavesurferControl(waveform){
            this.wavesurfer = WaveSurfer.create({
                container: waveform,
                waveColor: 'white',
                progressColor: 'red',
                backend: 'MediaElement',
                fillParent: true,
                height: '64',
                plugins: [
                    WaveSurfer.regions.create({
                        
                    }),
                ]
            })

        }

        return WavesurferControl
    }())

    var interfaceApp = {
        videoElement: '',
        canvasElement: document.getElementById('canvas'),
        videoControllElement: document.getElementById('waveform'),
        hands: '',
        canvas: '',
        wavesurfer: '',

        load: async function(video, canvas){
            this.videoElement = video
            this.hands = new DrawingHands(video)
            this.canvas = new DrawingCanvas(canvas)
            this.wavesurfer = new WavesurferControl(this.videoControllElement).wavesurfer

            try{
                await Promise.all([
                    this.wavesurfer.load(video),
                    this.wavesurfer.enableDragSelection({
                        drag: true
                    }), 
                    this.wavesurfer.on('ready', function(){
                        console.log('wavesurfer load complete!')
                    }, { once: true }),
                    this.hands.load()
                ]).then(function(value){
                    console.log('handpose load complete!')
                    interfaceApp.hands.ready()
                    return interfaceApp.ready()
                }).catch(function(err){
                    throw new Error(err)
                })
            }catch(error){
                return { status: 'load Failed!', error: error }
            }
            // await this.wavesurfer.load(this.videoElement)
            // await this.wavesurfer.on('ready', function(){
            //     console.log('wavesurfer load complete!')
            // }, { once: true })

            // await this.hands.load()
            // .then(resolve => {
            //     console.log('handpose load complete!')
            //     return this.ready()
            // })
            // .catch(err => {throw new Error(err)})
        },

        ready: function(){
            this.canvas.setSize(this.videoElement)
            console.log('The interface app is ready.')
            return 'loaded'
        }   
    }

    return interfaceApp

})()

var MoveElement = (function(){
    function MoveElement(element, originElement){
        this.element = element
        this.status = 'not clicked'
        this.startX = 0
        this.startY = 0
        this.originElement = originElement
        this.originX = this.originElement.getBoundingClientRect().left
        this.originY = this.originElement.getBoundingClientRect().top
    }

    MoveElement.prototype.active = function(option){
        this.element.classList[option]('moving')
    }

    MoveElement.prototype.startPos = function(x, y){
        this.status = 'clicked'
        this.startX = x + this.originX
        this.startY = y + this.originY
        this.active('add')
    }

    MoveElement.prototype.transform = function(x, y){
        this.element.style.transform = `translate(${x - this.startX}px, ${y - this.startY}px)`
    }

    MoveElement.prototype.posInit = function(){
        this.status = 'not clicked'
        this.startX = 0
        this.startY = 0
        this.active('remove')
    }

    return MoveElement
}())