class World {
    //(i, j) where i is the column and j is the row. Higher j =  lower on page, Higher i = to the right

    constructor(worldWidth, worldHeight, database) {
        this.worldWidth = worldWidth
        this.worldHeight = worldHeight
        this.blockSize = worldWidth*0.075 //world grid's block size
        this.world = new Array(floor(worldWidth/this.blockSize)) 
        for (let i = 0; i < this.world.length; i++) {
            this.world[i] = new Array(floor(worldHeight/this.blockSize))
            for (let j = 0; j < this.world[i].length; j++) {
                this.world[i][j] = new Object()
            }
        }
        this.groundLevel = this.world[0].length-3 > 0 ? this.world[0].length-3 : this.world[0].length-2
        this.characters = []
        this.characterPositions = []
        this.charsToDisplay = 5
        this.walked = false
        var ref = database.ref('drawings')
        const charQuery = ref.orderByChild("timestamp").limitToFirst(this.charsToDisplay).on("child_added", (data) => {
            console.log(data.key)
            console.log(data.val())
            this.characters.push(data.val())
            // this.characterPositions.push(data.key)
            this.initChars(data.key)
        }, (err) => console.log(err))

        for (let i = 0; i < this.world.length; i++) {
            for (let j = 0; j < this.world[i].length; j++) {
                if (j > this.world[i].length-3 || j == this.world[i].length-1) {
                    this.world[i][j].background = "Grass"
                } else {
                    this.world[i][j].background = "Sky"
                }
                square(i*this.blockSize, j*this.blockSize, this.blockSize)
                // count++
            }
        }
    }
    displayCheckered(){
        let count = 0
        noStroke()
        for (let i = 0; i < this.world.length; i++) {
            for (let j = 0; j < this.world[i].length; j++) {
                if (count % 2 == 0) {
                    fill(128)
                } else {
                    fill(88)
                }
                square(i*this.blockSize, j*this.blockSize, this.blockSize)
                textSize(10);
                fill(0, 102, 153);
                text(""+i+", "+j, i*this.blockSize, (j+1)*this.blockSize)
                count++
            }
        }
    }

    display() {
        // noStroke()
        this.walked = false
        for (let i = 0; i < this.world.length; i++) {
            for (let j = 0; j < this.world[i].length; j++) {
                if (this.world[i][j].background == "Grass") {
                    fill(126, 200, 80) //Green
                } else if (this.world[i][j].background == "Sky") {
                    fill(136, 206, 235) //Blue
                }
                noStroke()
                square(i*this.blockSize, j*this.blockSize, this.blockSize)
                stroke(255)
                strokeWeight(3)
                if (this.world[i][j].hasOwnProperty('character')) {
                    let choice = Math.floor(Math.random() * 500) //choice is between 0 - 100
                    if (choice < 10 && !this.walked) {
                        this.walkChar(i, j)
                        // console.log("shifted character")
                    } else {
                        stroke(255)
                        strokeWeight(3)
                        this.world[i][j].character.renderConstrained(i*this.blockSize, j*this.blockSize, this.blockSize, this.blockSize)
                    }
                    
                }
            }
        }
    }

    // displayCharacters() {
    //     // print("Drawing characters here!")
    //     let i = 0 
    //     let j = this.groundLevel
    //     // fill(165,42,42) //Brown
    //     stroke(255)
    //     strokeWeight(3)
    //     noFill()
    //     // square(i*this.blockSize, j*this.blockSize, this.blockSize)
    //     if (this.characters != null) {
    //         for (const [key, val] of Object.entries(this.characters)) {
    //             // console.log("Drawing " + key)
    //             let drw = new UserDrawing()
    //             drw.displayNewDrawing(val)
    //             drw.renderConstrained(i*this.blockSize, j*this.blockSize, this.blockSize, this.blockSize)
    //         }
    //     } 
    // }


    initChars(key) {
        let randomX = 0
        while (this.world[randomX][this.groundLevel].hasOwnProperty('character')) {
            randomX = Math.floor(Math.random() * this.world.length)
        }
        
        let newChar = new UserDrawing()
        newChar.displayNewDrawing(this.characters[this.characters.length-1])
        this.characterPositions.push({
            character : newChar,
            x : randomX,
            y : this.groundLevel
        })
        this.world[randomX][this.groundLevel].character = newChar

        if (this.characters.length > this.charsToDisplay) {
            this.removeChar()
        }
    }

    removeChar() {
        this.characters.shift()
        let obj = this.characterPositions.shift()
        delete this.world[obj.x][obj.y].character
    }

    walkChar(oldX, oldY) {
        for (let i = 0; i < this.characterPositions.length; i++) {
            var chrPos = this.characterPositions[i]
            if (chrPos.x == oldX && chrPos.y == oldY) {
                if ((oldX + 1 < this.world.length) && (!this.world[oldX+1][this.groundLevel].hasOwnProperty('character'))) {
                    chrPos.x = oldX + 1
                    // console.log("Walking character in " + oldX + ", " + oldY + " to " + chrPos.x + ", " + chrPos.y)
                    this.world[chrPos.x][chrPos.y].character = this.world[oldX][oldY].character
                    this.world[chrPos.x][chrPos.y].character.constrainedDrawing = null
                    delete this.world[oldX][oldY].character
                    this.walked = true
                    // console.log(this.world[oldX][oldY])
                    // console.log(this.world[chrPos.x][chrPos.y])
                } else if (oldX - 1 >= 0 && !this.world[oldX-1][this.groundLevel].hasOwnProperty('character')) {
                    chrPos.x = oldX - 1
                    // console.log("Walking character in " + oldX + ", " + oldY + " to " + chrPos.x + ", " + chrPos.y)
                    this.world[chrPos.x][chrPos.y].character = this.world[oldX][oldY].character
                    this.world[chrPos.x][chrPos.y].character.constrainedDrawing = null
                    delete this.world[oldX][oldY].character
                    this.walked = true
                }
                return
            }
        }
    }
}