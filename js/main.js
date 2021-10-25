(function(){
    'use strict'

    var app = {
        interface: interfaceApp,
        menuBtn: document.querySelector('.menu-bar'),
        toolBtn: document.querySelector('.tool-bar'),
        fileBtn: document.querySelector('#openFile'),
        status: 'load',
        video: {
            element: '',
            status: 'pause',
            scaleX: '',
            scaleY: '',
        },

        canvas: {
            element: '',
        },

        darwOption: {
            radius: 3,
            color: 'red' 
        },

        workArray: [],
        activeEvent: false,
        mode: '',
    }

    app.markScale = function(){
        var markScale = document.querySelectorAll('.work-footer > .work-scale span')
        var video = app.video.element
        var scale = calcScale(video.videoWidth, video.videoHeight, video.offsetWidth, video.offsetHeight)
        markScale[1].textContent = scale.x.toFixed(2)
        markScale[3].textContent = scale.y.toFixed(2)
        app.video.scaleX = scale.x
        app.video.scaleY = scale.y
    }

    app.video.volumeUp = function(){

    }

    app.video.volumeDown = function(){

    } 

    app.initialize = function(){
        var workVideoArea = document.querySelector('.work-video-area')
        var videoWrapper = document.getElementById('video-wrapper')
        var waveform = document.getElementById('waveform')
        var canvasWrapper = document.getElementById('canvas-wrapper')
        var playPause = document.getElementById('playPause')

        for(var i = 0; i < videoWrapper.childNodes.length; i++){
            videoWrapper.removeChild(videoWrapper.childNodes[i])
        }
        
        for(var i = 0; i < waveform.childNodes.length; i++){
            waveform.removeChild(waveform.childNodes[i])
        }

        for(var i = 0; i < canvasWrapper.childNodes.length; i++){
            canvasWrapper.removeChild(canvasWrapper.childNodes[i])
        }

        app.video.status = 'pause'
        app.observer.disconnect()

        workVideoArea.classList.remove('active')
        playPause.classList.remove('active')
    }

    /**
     * @param {readAsDataURL} url 
     * @param {object} fileInfo other file infomation
     */
    app.load = async function({ url, fileInfo }){
        app.initialize()

        var workVideoArea = document.querySelector('.work-video-area')
        var videoWrapper = document.getElementById('video-wrapper')
        var canvasWrapper = document.getElementById('canvas-wrapper')
        var fileName = workVideoArea.querySelector('.work-video-area .file-name')
        var markDuration = document.querySelector('.work-footer > .work-timer > span:last-child')

        this.video.element = document.createElement('video')
        this.canvas.element = document.createElement('canvas')

        var video = this.video.element
        var canvas = this.canvas.element

        video.id = 'videoElement'
        video.src = url

        canvas.id = 'canvas'
        fileName.textContent = fileInfo.name

        videoWrapper.append(video)
        canvasWrapper.append(canvas)
        workVideoArea.classList.add('active')

        app.status = app.interface.load(video, canvas.id)
        .then(function(resolve){
            // console.log(app)
            app.markScale()
            markDuration.textContent = formatTime(app.interface.wavesurfer.getDuration())
            if(!app.activeEvent) app.loadEvent() 
        }).catch(function(error){
            throw new Error('Failed to load.')
        })
    }    

    app.menubar = {
        openFileBtn: function(e){
            console.log(e.target.id)
            app.fileBtn.click()
        },

        saveFileBtn: function(e){
            console.log(e.target.id)
        }
    }

    app.toolbar = {
        drawCircle: function(e){
            var pointList = app.interface.hands.drawPoint()
            var video = app.video.element

            if(pointList.length > 0){

                for(var i = 0; i < pointList.length; i++){
                    app.interface.canvas.draw(pointList[i][0] * video.scaleX, pointList[i][1] * video.scaleY, app.darwOption.radius, app.darwOption.color)
                }

            }else{
                console.log('not recognized.')
                //인식하지 못했을 때 알람
            }
        },
        
        playPause: function(e){
            var playPause = document.getElementById('playPause')

            // console.log(this.video.status)
            switch(this.video.status){
                case 'pause':
                    app.interface.wavesurfer.play()
                    app.video.status = 'play'
                    playPause.classList.add('active')
                break
                case 'play':
                    app.interface.wavesurfer.pause()
                    app.video.status = 'pause'
                    playPause.classList.remove('active')
                break
            }
        },

        volumeController: function(e){
            if(e.target.nodeName === 'INPUT' || e.target.nodeName === 'DIV') return
            volumeController.classList.toggle('toggle')
        }
    }

    //event
    app.menuBtn.addEventListener('click', function(e){
        if(app.menubar[e.target.id]){
            app.menubar[e.target.id](e)
        }
    })

    //file
    app.fileBtn.addEventListener('change', function(e){
        if(!e.target.files || !e.target.files.length) return console.log('not Files')
        if(checkFileExtension(e.target.files[0].name)){
            var reader = new FileReader()
            var fileInfo = e.target.files[0]
            reader.readAsDataURL(fileInfo)
            reader.addEventListener('load', function(e){
                app.load.call(app, { url: e.target.result, fileInfo: fileInfo })
            })
        }else{
            return console.log('mp4 확장자가 아닙니다.')
        }
    })

    app.loadEvent = function(){
        app.activeEvent = true
        var volumeController = document.getElementById('volumeController')
        var volumeInput = document.querySelector('#volumeController input')
        var timer = document.querySelector('.work-footer > div > span:first-child') 

        console.log('Event Activation!')

        app.toolBtn.addEventListener('click', function(e){
            var button = e.target.closest('button')
            if(!button) return
            if(app.toolbar[button.id]){
                app.toolbar[button.id].call(app, e)
            }
        })

        // app.interface.wavesurfer.on('pause', function(){ 
        //     app.video.status = 'pause'
        //     playPause.classList.remove('active')
        // })
    
        // app.interface.wavesurfer.on('play', function(){
        //     app.video.status = 'play'
        //     playPause.classList.add('active')
        // })

        // app.interface.wavesurfer.on('region-created', function(region){
        //     console.log('region 생성')
        // })

        app.interface.wavesurfer.on('region-update-end', function(region){
            console.log('region 업데이트')
        })

        app.interface.wavesurfer.on('audioprocess', function(){
            timer.textContent = formatTime(app.interface.wavesurfer.getCurrentTime())
        })

        volumeInput.addEventListener('change', function(e){
            app.video.element.volume = e.target.value
            if(e.target.value != 0){
                volumeController.classList.remove('active')
            }else{
                volumeController.classList.add('active')
            }
        })
        
        //audioprocess 
    }
    
    //keyEvent
}())
