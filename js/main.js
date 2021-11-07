var app = (function(){
    'use strict'
    //private
    console.count('run count')

    var app = {
        interface: interfaceApp,
        menuBtn: document.querySelector('.menubar'),
        toolBtn: document.querySelector('.toolbar'),
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
        // var waveform = document.getElementById('waveform')
        var canvasWrapper = document.getElementById('canvas-wrapper')
        var playPause = document.getElementById('playPause')
        var clipList = document.querySelector('.clip-list')
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

        var i = videoWrapper.childNodes.length
        for(i; i > 0; i--){
            if(videoWrapper.childNodes[i]){
                videoWrapper.childNodes[i].remove()
            }
        }

        if(app.interface.wavesurfer){
           app.interface.wavesurfer.destroy() 
        }

        i = canvasWrapper.childNodes.length
        for(i; i > 0; i--){
            if(canvasWrapper.childNodes[i]){
                canvasWrapper.childNodes[i].remove()
            }
        }
        
        i = clipList.childNodes.length
        for(i; i > 0; i--){
            if(clipList.childNodes[i]){
                clipList.childNodes[i].remove()
            }
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
        scaleCanModified: false, 
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
        },

        possibleScale: function(e){
            var possibleScale = document.getElementById('possibleScale')
            app.toolbar.scaleCanModified = possibleScale.classList.toggle('toggle')
            console.log(app.toolbar.scaleCanModified)
        },

        centerTheElement: function(e){
            this.centerArea()
        },

        leftSide: function(button){
            if(button.classList.contains('open-btn')){
                var clip = button.parentNode
                var icon = clip.querySelector('.material-icons')

                clip.classList.toggle('open-and-close')?
                // clip.contains('open-and-close')? 
                icon.textContent = 'expand_more' : icon.textContent = 'expand_less'
            }
        },

        rightToolbarView: function(e, btn){
            var rightAsideInfo = document.querySelector('.right-aside-info')
            var span = btn.querySelector('span')
            rightAsideInfo.classList.toggle('close') ? span.textContent = 'chevron_left' : span.textContent = 'navigate_next' 
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

    app.data = {
        fileName: '',
        clips: [],
        sets: [],
    }

    // Object.defineProperty(app.clip, 'create', {
    //     get() {
    //         console.log('get!');
         
    //     },
    //     set(value) {
    //         console.log(value)
    //     }
    // })

    app.set = {

    }

    app.clip = {
        rule: {
            naming: 'clip_',
            number: 0,
        },
        split: 5,
        selected: [],
        find: function(id){
            var array = app.data.clips

            var region = array.find(function(clip){
                return clip.id === id
            })

            var index = array.findIndex(function(clip){
                return clip.id === id
            })

            return { index: index, region: region }
        },
        create: async function(region){
            var find = app.clip.find(region.id)

            if(find.region) return app.clip.update(region, find.index)
            
            var clipList = document.querySelector('.clip-list')
            var time = timeDivid(region.start, region.end, app.clip.split)

            var variable = {
                id: region.id,
                start: region.start,
                end: region.end,
                frames: []
            }
            
            app.data.clips.push(variable)

            var divOption = {
                className: 'clip',
                id: region.id
            }
            
            //src 부분 개선할 필요 있음
            // var videoOption = {
            //     src: app.video.element.src + `#t=${region.start}, ${region.end}`,
            //     currentTime: region.start,
            //     title: region.start + ' ~ ' + region.end
            // }

            // var newSrc = new Blob(
            //     app.video.element.src + `#t=${region.start}, ${region.end}`
            //     , { type: 'video/mp4' }    
            // )

            // console.log(app.video.element.src)
            // var file = new File([app.video.element.src + `#t=${region.start}, ${region.end}`], 'any')
            // // console.log(file)
            // var newSrc = new Blob(
            //     [file], { type: 'video/mp4' }
            // )
            // console.log(file)
            // console.log(newSrc)

            var videoOption = {
                // src: URL.createObjectURL(newSrc),
                src: app.video.element.src + `#t=${region.start}, ${region.end}`,
                currentTime: region.start,
                title: region.start + ' ~ ' + region.end
            }

            var parentEl = addElement('div', clipList, divOption)
            var button = addElement('button', parentEl, { type: 'button', className: 'open-btn' })

            addElement('span', button, null, region.id)
            addElement('span', button, { className: 'material-icons' }, 'expand_less')
            
            var div = addElement('div', parentEl, { className: 'clip-video-container' })
            addElement('video', div, videoOption)  

            /*
                <span class="material-icons-outlined">
                    expand_more
                </span>
            */
            var framesDiv = addElement('div', parentEl, { className: 'frames'})
            time.forEach(time => app.frame.create(time, framesDiv))
        },

        update: function(region, index){
            var data = app.data

            data.clips[index].start = region.start
            data.clips[index].end = region.end

            var option = {
                src: app.video.element.src + `#t=${region.start}, ${region.end}`,
                currentTime: region.start 
            }

            updateElement(`#${region.id} video`, option)
        },

        focus: function(region){

        },

        waiting: []
    }

    app.frame = {
        status: 'not',
        create: async function(time, parentEl){
            if(app.frame.status === 'run'){
                return app.frame.waiting.push([time, parentEl])
            }

            app.frame.status = 'run'
            var video = app.copyVideo.element
            var canvas = app.canvasForImage.element
            var context = app.canvasForImage.context

            video.currentTime = time

            return video.addEventListener('canplaythrough', async function(){
                await context.drawImage(video, 0, 0)
                addElement('img', parentEl, 
                { 
                    src: canvas.toDataURL(),
                    title: time,
                })
                app.frame.sequentialExecution()
            }, { once: true })  
        },

        waiting: [],

        sequentialExecution: function(){
            app.frame.status = 'not'
            if(app.frame.waiting.length > 0){
                app.frame.create(app.frame.waiting[0][0], app.frame.waiting[0][1]) 
                app.frame.waiting.shift()
            }
        }
    }

    app.wheel = function(event){
        if(!app.toolbar.scaleCanModified) return
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
            var rightAsideInfo = document.querySelector('.right-aside-info')

            console.log('Event Activation!')

            rightAsideInfo.addEventListener('click', function(e){
                var button = e.target.closest('button')
                if(!button) return
                if(button.id){
                    app.toolbar[button.id](e, button)
                }else{
                    app.toolbar.leftSide(button)
                }
            })

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
                var regionElement = document.querySelector(`[data-id=${region.id}]`)
                var rule = app.clip.rule

                region.id = rule.naming + rule.number
                regionElement.dataset.id = rule.naming + rule.number

                rule.number++
            })
        }
    }
    //keyEvent

    //event - end


    //resize pulic
    return app.public = {
        resizeInit: function(){
            console.log('resize event')
        },
        info: {
            all: function(){
                console.log(app)
            },
            data: function(){
                console.log(app.data)
            }
        }
            
    }
}())
