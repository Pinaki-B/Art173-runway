class UserDrawing {
    userDrawing = []

    constructor() {
        // console.log("Created new drawing")
        this.userDrawing = [] //composed of multiple 'shapes'
        this.currShape = [] //connected arr of points
        this.isDrawing = false
        this.artist = ""
        this.title = ""
        this.shiftedDrawing = null
        this.bounds = null
        this.constrainedDrawing = null
        // console.log(typeof(this.currShape))
        // this.drawing.push(["Hello"])
    }

    checkAndUpdate(x, y) {
        if (this.isDrawing) {
            console.log("Updating")
            this.currShape.push({x: x, y: y})
        }
    }

    startDraw() {
        this.currShape = []
        console.log("drawing")
        console.log(this.userDrawing)
        this.isDrawing = true
        this.userDrawing.push(this.currShape)
    }

    endDraw() {
        console.log("stopped drawing")
        this.isDrawing = false
    }

    render() {
        // console.log("out of loop")
        this.userDrawing.forEach((shape, index) => {
            // console.log("In loop 1")
            beginShape()
            shape.forEach((pt, index) => {
                // console.log("In loop 2")
                vertex(pt.x, pt.y)
            })
            endShape()
        })
    }

    dataSent() {
        console.log("Saved drawing!")
    }

    saveDrawing(database, artist, title) {
        var ref = database.ref('drawings')
        var data = {
            artist: artist,
            title: title,
            drawing: this.userDrawing,
            timestamp: -int(Date.now()/1000)
        }
        ref.push(data, this.dataSent)
    }

    displayNewDrawing(newUserDrawing) {
        this.artist = newUserDrawing.artist
        this.title = newUserDrawing.artist
        this.userDrawing = newUserDrawing.drawing
        this.currShape = []
    }


    renderConstrained(x, y, width, height) {
        //get newly scaled/shifted points

        if (this.shiftedDrawing == null) {
            this.getShiftedDrawing()
        }

        if (this.bounds == null) {
            let bounds = this.getBounds()
            this.bounds = {
                minX : bounds[0],
                maxX : bounds[1],
                minY : bounds[2],
                maxY : bounds[3]
            }
        }


        if (this.constrainedDrawing == null) {
            // console.log("Computing contrained drawing")
            this.constrainedDrawing = []
            let constrainedCurrShape = []
            let xPadding = width*0.05
            let yPadding = height*0.05
            this.userDrawing.forEach((shape, index) => {
                constrainedCurrShape = []
                shape.forEach((pt, index) => {
                    let newX = map(pt.x, this.bounds.minX, this.bounds.maxX, x+xPadding, x+width-xPadding)
                    let newY = map(pt.y, this.bounds.minY, this.bounds.maxY, y+yPadding, y+height-yPadding)
                    constrainedCurrShape.push({x: newX, y: newY})
                })
                this.constrainedDrawing.push(constrainedCurrShape)
            })
            // rect(x+xPadding, y+yPadding, width-xPadding, height-yPadding)
        }
        
        // console.log(this.constrainedDrawing)

        this.constrainedDrawing.forEach((shape, index) => {
            // console.log("Drawing contrained drawing")
            beginShape()
            shape.forEach((pt, index) => {
                vertex(pt.x, pt.y)
            })
            endShape()
        })

        // console.log("Finished drawing new character at col " + x)
    }

    getBounds() {
        let minX = Infinity
        let minY = Infinity
        let maxX = -1
        let maxY = -1
        this.userDrawing.forEach((shape, index) => {
            shape.forEach((pt, index) => {
                if (pt.x < minX) {
                    minX = pt.x
                }
                if (pt.y < minY) {
                    minY = pt.y
                }
                if (pt.x > maxX) {
                    maxX = pt.x
                }
                if (pt.y > maxY) {
                    maxY = pt.y
                }
            })
        })
        return [minX, maxX, minY, maxY]
    }

    getShiftedDrawing() {
        //Find minimum x and min y
        let minX = Infinity
        let minY = Infinity
        this.userDrawing.forEach((shape, index) => {
            shape.forEach((pt, index) => {
                if (pt.x < minX) {
                    minX = pt.x
                }
                if (pt.y < minY) {
                    minY = pt.y
                }
            })
        })
        //create a zero-shifted drawing
        this.shiftedDrawing = []
        let shiftedCurrShape = []
        this.userDrawing.forEach((shape, index) => {
            shiftedCurrShape = []
            shape.forEach((pt, index) => {
                let newX = pt.x-minX
                let newY = pt.y-minY
                shiftedCurrShape.push({x: newX, y: newY})
            })
            this.shiftedDrawing.push(shiftedCurrShape)
        })
        return this.shiftedDrawing
    }
}