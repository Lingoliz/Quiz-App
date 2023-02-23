let btn = document.querySelector('button');
let content = document.querySelector('main .content');
let answer = document.querySelector('.answer');
let score = 0;
let data = {};
let counter = 0;

if (localStorage.length ) {
  if (localStorage.hightScore.length) {
    document.querySelector('.higher-score-value').innerText = localStorage.getItem('hightScore')
  }
}

function getData() {
  fetch('https://the-trivia-api.com/api/questions/')
  .then((req)=> {
      return req.json()
    })
    .then((result=> {
      data = result;
      creatQst(data)
    }))
}

function creatQst(data) {
 
  let qstList =  [...data[counter].incorrectAnswers, data[counter].correctAnswer]
  let randomNumbers = []
  while (randomNumbers.length != 4) {
    let num = Math.round(Math.random()*3);
    if (!randomNumbers.includes(num)) {
      randomNumbers.push(num)
    }
  }
 
  content.innerHTML = `
  <h1>${data[counter].question}</h1>
  <ul>
      <li><span>A</span><p class='qst-p'>${qstList[randomNumbers[0]]}</p></li>
      <li><span>B</span><p class='qst-p'>${qstList[randomNumbers[1]]}</p></li>
      <li><span>C</span><p class='qst-p'>${qstList[randomNumbers[2]]}</p></li>
      <li><span>D</span><p class='qst-p'>${qstList[randomNumbers[3]]}</p></li>  
  </ul>
  `
}

btn.addEventListener('click',(e)=> {
  e.target.style.display='none'
  getData()
})

function restart(target) {
  target.forEach((e)=> e.remove() )
  
  let result = document.createElement('div')
  result.className ='result'
  result.innerHTML = `
    <h2>Your Score : ${score}</h2>
  `
  content.append(result)
  let text = document.createTextNode('Reastart');
  let btn2 = document.createElement('button');
  btn2.id='restart';
  btn2.append(text)
  content.append(btn2)
  document.querySelector('.higher-score-value').innerHTML = localStorage.getItem('hightScore');
  score = 0
  counter = 0

}


document.addEventListener('click',(event)=> {
  if (event.target.className == 'qst-p') {
    if (event.target.innerText === data[counter].correctAnswer) {
      event.target.classList.add('correct');
      score +=10;
      document.querySelector('.score-value').innerText = score
      counter ++;
      answer.classList.add('correct')
      document.querySelector('.answer p').innerText = 'Correct'
      if (counter <= 9) {
        setTimeout(()=> {
          answer.classList.remove('correct')
            creatQst(data)
          },2500)
      }else {
        setTimeout(()=> {
          answer.classList.remove('correct')
          addHightScoore()
          restart(document.querySelectorAll('.content ul, .content h1'))
            
          },2500)
      }
    }
    else {
      event.target.classList.add('wrong');
      answer.classList.add('wrong')
      document.querySelector('.answer p').innerText = 'Wrong'
      document.querySelectorAll('ul li p').forEach((e)=> {
        if (e.innerText == data[counter].correctAnswer ){
          e.classList.add('correct')
        }
      })
      counter ++
      
      if (counter <= 9) {
        setTimeout(()=> {
          answer.classList.remove('wrong');
          creatQst(data)
        },2500)
      }else {
        setTimeout(()=> {
          answer.classList.remove('wrong');
          addHightScoore()
          restart(document.querySelectorAll('.content ul, .content h1'));
          
        },2500)
      }
    }
  }
})

function addHightScoore() {
  if (score > localStorage.setItem('hightScore',score)) {
    localStorage.setItem('hightScore',score);
  }
}

document.addEventListener('click',(event)=>{
  if (event.target.id == 'restart'){
    getData()
  }
})