/**
 * Desc:    梵高呐喊 图片测试
 * Author:  J.W.
 */

const cv = document.getElementById('cv')
const ctx = cv.getContext('2d')

const {PI, random, asin, atan, sin, cos, round} = Math

const screamer = document.getElementById('screamer')
let imgData = null

function modlen (x, y) {
  return (x**2 + y**2) ** 0.5
}

class Wool {
  constructor () {
    ctx.drawImage(screamer, 100, 100)
    imgData = ctx.getImageData(100, 100, 467, 600)
    ctx.fillColor = 'black'
    ctx.fillRect(0, 0, 600, 800)

    this.dir = [...Array(3).keys()].map(() => {
      return {x: random(), y: random()}
    })
    this.pos = [...Array(3).keys()].map(() => {
      return {x: random()*467+100, y: random()*600+100}
    })

    this.timerIdArr = [-1, -1, -1]
  }

  drawRandomOnce (currPos, currDir) {
    // ctx.lineWidth = 5
    ctx.beginPath()
    ctx.moveTo(currPos.x, currPos.y)

    const rdm = random()
    let length = rdm*20
    // length /= 10.0
    let angle = (1-rdm-0.5) * PI // [-PI/2, PI/2) 之间
    angle += rdm > 0.62 ? PI : 0 // 0.62的几率可以换向

    if (currDir.x === 0) { currDir.x = 1e-8 }
    let currDirAngle = atan(currDir.y / currDir.x)
    let nextAngle = angle + currDirAngle
    // 下面两处random必须是和rdm之间三者独立
    let nextDirX = cos(nextAngle) * (random()>0.62?1:-1)
    let nextDirY = sin(nextAngle) * (random()>0.38?1:-1)
    
    let scale = length / modlen(nextDirX, nextDirY)
    currPos.x += nextDirX * scale
    currPos.y += nextDirY * scale
    
    currDir.x = nextDirX
    currDir.y = nextDirY

    ctx.strokeStyle = this.getPosColor({x: currPos.x-100, y: currPos.y-100})
    // ctx.beginPath()
    // ctx.moveTo(currPos.x-2, currPos.y+2)
    ctx.lineTo(currPos.x, currPos.y)
    ctx.stroke()
  }

  goOneThread (idx) {
    let pos = this.pos[idx]
    let dir = this.dir[idx]

    for (let i = 0; i < 10; i++) {
      this.drawRandomOnce(pos, dir)
      if (pos.x < 100 || pos.y < 100 || pos.x > 567 || pos.y > 700) {
        pos.x = random()*467 + 100
        pos.y = random()*600 + 100
      }
    }
  }

  runWool () {
    // 清理马赛克
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 600, 800)

    ;[0,1,2].forEach(idx => {
      this.timerIdArr[idx] = setInterval(() => {
        this.goOneThread(idx)
      }, 33)
    })
  }

  getPosColor (pos) {
    const idx = 4 * (round(pos.y) * 467 + round(pos.x))
    const color = imgData.data.slice(idx, idx+3)
    // console.log(round(pos.x), round(pos.y))
    return color.reduce((color, channel) => {
      return color + channel.toString(16).padStart(2, '0')
    }, '#')
  }

  runMosaic () {
    // 清理毛线团
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 600, 800)
    ;[0, 1, 2].forEach(idx => clearInterval(this.timerIdArr[idx]))

    for (let x = 0; x < 467; x += 7) {
      for (let y = 0; y < 600; y += 7) {
        let color = this.getPosColor({x, y})
        // console.log(color)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x+100, y+100, 3, 0, 2*PI)
        ctx.closePath()
        // ctx.stroke()
        ctx.fill()
      }
    }
  }
}

const w = new Wool()
const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')

btn1.onclick = () => w.runMosaic()
btn2.onclick = () => w.runWool()