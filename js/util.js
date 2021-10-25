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

function calcScale(plainWidth, plainHeight, changedWidth, changedHeight){
    var scaleX = changedWidth/plainWidth
    var scaleY = changedHeight/plainHeight
    return { x: scaleX, y: scaleY }
}


// 대상 node 선택

// // 감시자 인스턴스 만들기
// var observer = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//     console.log(mutation.type)
//   })
// })

// // 감시자의 설정:
// var config = { attributes: true, childList: true, characterData: true };

// // 감시자 옵션 포함, 대상 노드에 전달
// observer.observe(target, config);

// // 나중에, 감시를 중지 가능
// observer.disconnect();

//brouser size calc 후 화면보다 비디오가 클때 return size

//브라우저를 떠날 때 이벤트 beforeunload 작업중인 작업이 있는데 물어보기

//로컬 스토리지 작업중인 작업 저장
