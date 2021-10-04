(function(){
    'use strict'

    var app = {
    
        toolBtn: document.querySelector('.menu-bar'),
    }

    app.tool = {
        openFileBtn: function(e){
            console.log(e.target.id)
            document.querySelector('#openFile').click()
        },
        saveFileBtn: function(e){
            console.log(e.target.id)
        }
    }

    //event
    app.toolBtn.addEventListener('click', function(e){
        if(app.tool[e.target.id]){
            app.tool[e.target.id](e)
        }
    })

}())
