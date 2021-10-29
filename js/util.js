/**
 * @param {*string} string // 문자열
 * @returns {*boolean} // 정규식 테스트 리턴 값
 */
function checkFileExtension(string){
    var reg = new RegExp('\.mp4$', 'i')
    return reg.test(string) 
}

/**
 * 
 * @param {int} time 
 * @returns string min:second
 */
function formatTime(time){
    return [
        Math.floor((time % 3600) / 60), // minutes
        ('00' + Math.floor(time % 60)).slice(-2) // seconds
    ].join(':')
}

/**
 * @param {int} plainWidth 오리지널 너비
 * @param {int} plainHeight 오리지널 높이
 * @param {int} changedWidth 변화된 너비
 * @param {int} changedHeight 변화된 높이
 * @returns {x: float, y: float} 너비 스케일, 높이 스케일
 */
function calcScale(plainWidth, plainHeight, changedWidth, changedHeight){
    var scaleX = changedWidth/plainWidth
    var scaleY = changedHeight/plainHeight
    return { x: scaleX, y: scaleY }
}

/*  if - false 
    undefined, null
    NaN
    0 (숫자 리터럴) , -0
    “” (빈 문자열)
    false
*/

//시간 분할
/*
    start, end 포함 분할 
    split은 start와 end를 포함한 배열의 길이
    start = 1 , end = 9 라 가정했을 때
    둘의 차이는 8 이고 5분할 할것이니 
    8을 4로 나누면 2가 나오고 
    start값 부터 더하면 start와 end를 포함한 분할을 할 수 있음

    그러나 소수점 계산이라 끝까지 더하면 end부분에 오차가 발생할 것
    그래서 start end는 받은 값을 그대로 쓸거고 가운데에 start, end를 제외한 값을 추가할 것
*/
/**
 * 
 * @param {float} start region에서 나온 start
 * @param {float} end region에서 나온 end
 * @param {int} split 내가 정한 배열의 길이
 * @param {*} option 
 * @returns array start, end를 포함한 split 길이의 배열을 리턴합니다.
 */

function timeDivid(start, end, split, option){
    if(!split) return 
    var num = end - start
    var splitNum = num/(split - 1)
    var array = []

    for(var i = 1; i <= split - 2; i++){
        array.push(start + splitNum * i)
    }
    
    return [start, ...array, end]
}

//엘리먼트 만들기
function addElement(elementName, parent, option){
    var element = document.createElement(elementName)

    if(option){
        for(var key in option){
            element[key] = option[key]
        }
    }

    parent.append(element)
    return element 
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

//패딩 마진 등 각종 사이즈 가져오기

//polyfill