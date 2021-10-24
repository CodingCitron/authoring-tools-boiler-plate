/**
 * @param {*string} string // 문자열
 * @returns {*boolean} // 정규식 테스트 리턴 값
 */
function checkFileExtension(string){
    var reg = new RegExp('\.mp4$', 'i')
    return reg.test(string) 
}

function formatTime(time){
    return [
        Math.floor((time % 3600) / 60), // minutes
        ('00' + Math.floor(time % 60)).slice(-2) // seconds
    ].join(':')
}


//brouser size calc 후 화면보다 비디오가 클때 return size

//브라우저를 떠날 때 이벤트 beforeunload 작업중인 작업이 있는데 물어보기

//로컬 스토리지 작업중인 작업 저장
