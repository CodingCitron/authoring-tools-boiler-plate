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
            maxScale: 2,
            minScale: 0.01
        },
        copyVideo: {
            element: null,
        },
        canvas: {
            element: null,
        },
        canvasForImage: {
            element: null,
            context: null,
        },
        darwOption: {
            radius: 3,
            color: 'red' 
        },
        workArea: {
            originElement: document.querySelector('.work-area'), 
            element: document.querySelector('.work-video-area'),
            moveFunction: ''
        },
        activeEvent: false,
        mode: '',
        store: {

        }
    }

    app.loading = {
        element: document.querySelector('.loading'),
        status: 'hidden',

        start: function(message){
            var loding = app.loading
            var messageEl = loding.element.querySelector('.message')

            loding.status = 'active'
            loding.element.classList.remove('hidden')
            messageEl.textContent = message? message : 'loading...'
        },

        end: function(){
            var loding = app.loading

            loding.status = 'hidden'
            loding.element.classList.add('hidden')
        },

        message: function(message){
            var messageEl = loding.element.querySelector('.message')

            messageEl.textContent = message? message : 'loading...'
        }
    }

    //method - start
    app.initialize = function(){
        var workVideoArea = document.querySelector('.work-video-area')
        var videoWrapper = document.getElementById('video-wrapper')
        var waveform = document.getElementById('waveform')
        var canvasWrapper = document.getElementById('canvas-wrapper')
        var playPause = document.getElementById('playPause')
        var copyVideo
        var canvasforImage

        if(!app.copyVideo.element){
           copyVideo = document.createElement('video')
           copyVideo.id = 'copyVideo'
           app.copyVideo.element = copyVideo
           console.log(copyVideo)
        }

        if(!app.canvasForImage.element){
            canvasforImage = document.createElement('canvas')
            canvasforImage.id = 'canvasforImage'
            app.canvasForImage.element = canvasforImage
            app.canvasForImage.context = canvasforImage.getContext('2d')
            console.log(app.canvasForImage.context)
        }

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
        workVideoArea.classList.remove('active')
        playPause.classList.remove('active')
    }

    /**
     * @param {object} object 
     */
    app.load = async function(object){
        app.loading.start()
        app.initialize()

        var workVideoArea = document.querySelector('.work-video-area')
        var videoWrapper = document.getElementById('video-wrapper')
        var canvasWrapper = document.getElementById('canvas-wrapper')
        var fileName = workVideoArea.querySelector('.work-video-area .file-name')

        this.video.element = document.createElement('video')
        this.canvas.element = document.createElement('canvas')

        var video = this.video.element
        var copyVideo = this.copyVideo.element
        var canvas = this.canvas.element

        video.id = 'videoElement'
        video.src = URL.createObjectURL(object)
        copyVideo.src = URL.createObjectURL(object)

        canvas.id = 'canvas'
        fileName.textContent = object.name

        videoWrapper.append(video)
        canvasWrapper.append(canvas)
        workVideoArea.classList.add('active')
        
        // app.status = app.interface.load(video, canvas.id)
        // .then(function(resolve){
        //     app.markScale()
        //     markDuration.textContent = formatTime(app.interface.wavesurfer.getDuration())
        //     if(!app.activeEvent) app.loadEvent() 
        // }).catch(function(error){
        //     throw new Error('Failed to load.')
        // })
        return { video, canvas }
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
        AIDraw: function(e){
            var pointList = app.interface.hands.drawPoint()
            var video = app.video

            if(pointList.length > 0){

                for(var i = 0; i < pointList.length; i++){
                    app.interface.canvas.draw(pointList[i][0] * video.scaleX, pointList[i][1] * video.scaleY, app.darwOption.radius, app.darwOption.color)
                    console.log(pointList[i][0], pointList[i][1])
                    console.log(video.scaleX, video.scaleY)
                }
            }else{
                console.log('not recognized.')
                //인식하지 못했을 때 알람
            }
        },
        
        playPause: function(e){
            // console.log(this.video.status)
            switch(this.video.status){
                case 'pause':
                    app.interface.wavesurfer.play()
                break
                case 'play':
                    app.interface.wavesurfer.pause()
                break
            }
        },

        volumeController: function(e){
            if(e.target.nodeName === 'INPUT' || e.target.nodeName === 'DIV') return
            volumeController.classList.toggle('toggle')
        }
    }

    app.initSize = function(){
        var originElement = this.workArea.originElement
        var workArea = this.workArea.element
        var video = app.video.element
        var canvasForImage = app.canvasForImage.element

        canvasForImage.width = video.videoWidth
        canvasForImage.height = video.videoHeight

        var diffWidth = workArea.offsetWidth - video.offsetWidth
        var diffHeight = workArea.offsetHeight - video.offsetHeight
        var value

        if(originElement.offsetWidth < workArea.offsetWidth || originElement.offsetHeight < workArea.offsetHeight){

            var scale = calcScale(workArea.offsetWidth, workArea.offsetHeight, originElement.offsetWidth - diffWidth, originElement.offsetHeight - diffHeight)

            value = Math.min(scale.x, scale.y)
        }

        this.updateScale(value)
        this.centerArea()
    }

    app.centerArea = function(){
        var origin = this.workArea.originElement
        var workArea = this.workArea.element

        var x = origin.offsetWidth * 0.5 - workArea.offsetWidth * 0.5
        var y = origin.offsetHeight * 0.5 - workArea.offsetHeight * 0.5

        workArea.style.transform = `translate(${x}px, ${y}px)`
    }

    app.updateScale = function(...value){
        value[0] === undefined? value[0] = 1 : value 
        var video = app.video.element
        var width = video.videoWidth * value[0]
        var height = video.videoHeight * (value[1] || value[0])

        video.style.width = width + 'px'
        video.style.height = height + 'px'
        
        app.interface.canvas.setSize(video)

        app.markScale()
    }

    app.markScale = function(){
        var markScale = document.querySelectorAll('.work-footer .work-scale span')
        var video = app.video.element
        var scale = calcScale(video.videoWidth, video.videoHeight, video.offsetWidth, video.offsetHeight)

        markScale[1].textContent = scale.x.toFixed(2)
        markScale[1].title = scale.x
        markScale[3].textContent = scale.y.toFixed(2)
        markScale[3].title = scale.y

        app.video.scaleX = scale.x
        app.video.scaleY = scale.y
    }
    
    app.clip = {
        split: 5,
        create: async function(region){
            var clipList = document.querySelector('.clip-list')
            var time = timeDivid(region.start, region.end, app.clip.split)

            var divOption = {
                className: 'clip'
            }

            var videoOption = {
                src: app.video.element.src + `#t=${time[0]}, ${time[time.length - 1]}`,
                currentTime: time[0]
            }

            addElement('video', addElement('div', clipList, divOption), videoOption)  
        },

        waiting: []
    }

    app.data = {
        fileName: '',
        clip: []
    }

    app.frame = {
        create: async function(time){
            var video = app.copyVideo.element
            var canvas = app.canvasForImage.element
            var context = app.canvasForImage.context

            video.currentTime = time

            video.addEventListener('canplaythrough', async function(){
                await context.drawImage(video, 0, 0)
                img.src = canvas.toDataURL()
            }, { once: true })  
        },
        waiting: []
    }

    app.wheel = function(event){
        var { scaleX, scaleY, maxScale, minScale } = app.video

        scaleX = Number(scaleX.toFixed(2))
        scaleY = Number(scaleY.toFixed(2))

        if(event.wheelDelta > 0){
            if(maxScale <= scaleX || maxScale <= scaleY) return
            scaleX += 0.01
            scaleY += 0.01
        }else{
            if(minScale >= scaleX || minScale >= scaleY) return
            scaleX -= 0.01
            scaleY -= 0.01
        }

        app.updateScale(scaleX, scaleY)
    }

    //method - end

    //event - start
    app.menuBtn.addEventListener('click', function(e){
        if(app.menubar[e.target.id]){
            app.menubar[e.target.id](e)
        }
    })

    //file
    app.fileBtn.addEventListener('change', function(e){
        if(!e.target.files || !e.target.files.length) return console.log('not Files')
        if(checkFileExtension(e.target.files[0].name)){
            // var reader = new FileReader()
            // var fileInfo = e.target.files[0]
            // reader.readAsDataURL(fileInfo)
            // reader.addEventListener('load', function(e){
                app.load.call(app, e.target.files[0])
                .then(function(result){
                    result.video.addEventListener('loadeddata', function(){
                        app.status = app.interface.load(result.video, result.canvas.id)
                        .then(function(resolve){
                            app.initSize()
                            var markDuration = document.querySelector('.work-footer .work-timer span:last-child')
                            markDuration.textContent = formatTime(app.interface.wavesurfer.getDuration())
                            if(!app.activeEvent) app.loadEvent.maintained()
                            app.loadEvent.needReload()
                            app.workArea.moveFunction = new MoveElement(app.workArea.element, app.workArea.originElement)
                            app.loading.end()
                        }).catch(function(error){
                            throw new Error(error)
                        })  
                    }, { once: true })
                })
            // })
        }else{
            return console.log('mp4 확장자가 아닙니다.')
        }
    })

    app.loadEvent = {
        maintained: function(){
            app.activeEvent = true
            var volumeController = document.getElementById('volumeController')
            var volumeInput = document.querySelector('#volumeController input')
            var workArea = document.querySelector('.work-area')

            console.log('Event Activation!')

            app.toolBtn.addEventListener('click', function(e){
                var button = e.target.closest('button')
                if(!button) return
                if(app.toolbar[button.id]){
                    app.toolbar[button.id].call(app, e)
                }
            })

            volumeInput.addEventListener('change', function(e){
                app.video.element.volume = e.target.value
                if(e.target.value != 0){
                    volumeController.classList.remove('active')
                }else{
                    volumeController.classList.add('active')
                }
            })

            app.workArea.element.addEventListener('mousedown', function(e){
                var element = e.target.closest('div.work-range')
                if(element && element.classList.contains('work-range')) return
                if(e.target.nodeName === 'SPAN') return
                console.log(e.target.nodeName)
                app.workArea.moveFunction.startPos(e.offsetX, e.offsetY)
            })

            workArea.addEventListener('mousemove', function(e){
                if(app.workArea.moveFunction.status !== 'clicked') return
                app.workArea.moveFunction.transform(e.clientX, e.clientY)
            })

            workArea.addEventListener('mouseup', function(e){
                if(app.workArea.moveFunction.status !== 'clicked') return
                app.workArea.moveFunction.posInit()
            })

            workArea.addEventListener('wheel', app.wheel)
        },

        needReload: function(){
            var wavesurfer = app.interface.wavesurfer
            wavesurfer.unAll()
            
            var timer = document.querySelector('.work-footer .work-timer span:first-child')
            var playPause = document.getElementById('playPause')
            
            wavesurfer.on('region-update-end', function(region){
                app.clip.create(region)
            })

            wavesurfer.on('audioprocess', function(){
                timer.textContent = formatTime(app.interface.wavesurfer.getCurrentTime())
            })

            wavesurfer.on('pause', function(){ 
                app.video.status = 'pause'
                playPause.classList.remove('active')
            })
        
            wavesurfer.on('play', function(){
                app.video.status = 'play'
                playPause.classList.add('active')
            })

            wavesurfer.on('region-created', function(region){
                console.log('region 생성')
                
            })
        }
    }
    //keyEvent

    //event - end
}())
