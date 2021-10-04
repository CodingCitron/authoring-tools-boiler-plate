(function(){
    'use strict'

    var app = {
    
        menuBtn: document.querySelector('.menu-bar'),
        toolBtn: document.querySelector('.tool-bar'),
    }

    app.menubar = {
        openFileBtn: function(e){
            console.log(e.target.id)
            document.querySelector('#openFile').click()
        },
        saveFileBtn: function(e){
            console.log(e.target.id)
        }
    }

    app.toobar = {
        
    }

    //event
    app.menuBtn.addEventListener('click', function(e){
        if(app.menubar[e.target.id]){
            app.menubar[e.target.id](e)
        }
    })

}())
