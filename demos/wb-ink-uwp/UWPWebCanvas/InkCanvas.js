﻿import React from 'react';
import ReactDOM from 'react-dom';

class InkCanvas extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
			strokes: []
        }

        this.inking = false

        this.pointerDown = this.pointerDown.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
	}
    componentDidMount() {
		this.postRender()
    }
    componentDidUpdate(prevProps, prevState) {
        this.postRender()
    }
    createRainbowInkGradient(ctx, w, h) {
        var grd = ctx.createLinearGradient(0, 0, w, h)
        grd.addColorStop(0, '#D9492D')
        grd.addColorStop(0.15, '#E16D15')
        grd.addColorStop(0.3, '#F1CF67')
        grd.addColorStop(0.45, '#4AAE58')
        grd.addColorStop(0.6, '#57B2BF')
        grd.addColorStop(0.75, '#2A5091')
        grd.addColorStop(0.9, '#35175B')
        grd.addColorStop(0.9, '#35175B')
        return grd
    }
    pointerDown(event) {
		this.inking = true
        this.wetInk = [{ x: event.clientX, y: event.clientY }]

        let canvas = ReactDOM.findDOMNode(this.refs.inkcanvas)
        var ctx = canvas.getContext("2d");
        ctx.beginPath()

        let color = (this.props.inkColor == 'rainbow' ? this.createRainbowInkGradient(ctx, canvas.width, canvas.height) : this.props.inkColor)
        ctx.strokeStyle = color
        ctx.lineWidth = 3
	}
	pointerMove(event) {
		if (this.inking) {
			let lastPoint = this.wetInk.slice(-1)[0]
			let point = { x: event.clientX, y: event.clientY }

			let canvas = ReactDOM.findDOMNode(this.refs.inkcanvas)
            var ctx = canvas.getContext("2d");
            ctx.moveTo(lastPoint.x, lastPoint.y)
			ctx.lineTo(point.x, point.y)
			ctx.stroke()

			this.wetInk.push(point)
		}
	}
	pointerUp(event) {
		if (this.inking && this.wetInk.length > 1) {
            let stroke = {
                points: this.wetInk,
                color: this.props.inkColor
            }
			this.setState({ strokes: [...this.state.strokes, stroke] })
		}
		this.inking = false
		this.wetInk = []
	}
	render() {
		return (
            <canvas id="inkcanvas" ref="inkcanvas" width={this.props.width} height={this.props.height}/>
		);
	}
	postRender() {
		let canvas = ReactDOM.findDOMNode(this.refs.inkcanvas)
		canvas.addEventListener("pointerdown", this.pointerDown);
		canvas.addEventListener("pointermove", this.pointerMove);
		canvas.addEventListener("pointerup", this.pointerUp);

        var ctx = canvas.getContext("2d");
        var grd = this.createRainbowInkGradient(ctx, canvas.width, canvas.height)
        
        for (let s of this.state.strokes) {
            ctx.beginPath()
            ctx.strokeStyle = (s.color == 'rainbow' ? grd : s.color)
            ctx.lineWidth = 3
			ctx.moveTo(s.points[0].x, s.points[0].y)
			for (let pt of s.points.slice(1)) {
				ctx.lineTo(pt.x, pt.y)
			}
            ctx.stroke()
		}
	}
}

export default InkCanvas
