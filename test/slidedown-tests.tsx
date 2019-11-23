import React from 'react'
import ReactDOM from 'react-dom'
import enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TestRenderer from 'react-test-renderer'
import { expect } from 'chai'
import { SlideDown } from '../lib/slidedown'

/* Configure enzyme */
enzyme.configure({ adapter: new Adapter() })

/* async/await sleep */
function pause(millis) {
    return new Promise(resolve => setTimeout(resolve, millis))
}

describe('SlideDown', () => {
    let attachTo = null

    beforeEach(() => {
        if (attachTo) {
            ReactDOM.unmountComponentAtNode(attachTo)
        } else {
            attachTo = document.createElement('div')
            document.body.appendChild(attachTo)
        }
    })

    describe('simple rendering', () => {
        it('renders no children when empty', () => {
            const slidedown = enzyme.render(<SlideDown></SlideDown>)
            expect(slidedown.children()).to.have.length(0)
        })

        it('renders content when present', () => {
            const slidedown = enzyme.render(<SlideDown>findme</SlideDown>)
            expect(slidedown.text()).to.equal('findme')
        })

        it('renders container div with class react-slidedown', () => {
            const slidedown = enzyme.render(<SlideDown>anything</SlideDown>)
            expect(slidedown.hasClass('react-slidedown')).to.be.true
        })

        it('adds className property to container', () => {
            const slidedown = enzyme.render(<SlideDown className="my-class">slideme</SlideDown>)
            expect(slidedown.hasClass('react-slidedown')).to.be.true
            expect(slidedown.hasClass('my-class')).to.be.true
        })

        it('adds other props to container div', () => {
            const ref = React.createRef<HTMLDivElement>()
            ReactDOM.render(<SlideDown ref={ref} id="my-id">slideme</SlideDown>, attachTo)
            expect(ref.current.id).to.equal('my-id')
        })

        it('forwards object ref to outer div', () => {
            const ref = React.createRef<HTMLDivElement>()
            ReactDOM.render(<SlideDown ref={ref} className="my-class">slideme</SlideDown>, attachTo)
            expect(ref.current.tagName).to.equal('DIV')
            expect(ref.current.classList.contains('my-class')).to.be.true
        })

        it('forwards function ref to outer div', () => {
            let current: HTMLDivElement | null = null
            const refFn = ref => current = ref
            ReactDOM.render(<SlideDown ref={refFn} className="my-class">slideme</SlideDown>, attachTo)
            expect(current.tagName).to.equal('DIV')
            expect(current.classList.contains('my-class')).to.be.true
        })

        it('renders different element type when "as" prop is provided', () => {
            const ref = React.createRef<HTMLDivElement>()
            ReactDOM.render(<SlideDown ref={ref} as="span">slideme</SlideDown>, attachTo)
            expect(ref.current.tagName).to.equal('SPAN')
        })
    })

    describe('children', () => {
        it('transitions when children are added', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown"></SlideDown>, { attachTo })
            slidedown.setProps({ children: <div className="test-content" /> })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
            await pause(110)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
        })

        it('transitions when children are removed', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown" transitionOnAppear={false}><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
            slidedown.setProps({ children: null })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
            await pause(110)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
        })

        it('reverses transition when item is removed half-way through', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown"><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
            await pause(50)
            const midHeight = slidedown.find('.react-slidedown').getDOMNode().clientHeight
            expect(midHeight).to.be.lessThan(18)

            slidedown.setProps({ children: null })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(midHeight)
            await pause(50)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.be.lessThan(midHeight)
            await pause(60)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
        })
    })

    describe('transitionOnAppear', () => {
        it('transitions on mounting', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown"><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
            await pause(110)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
        })

        it('does not transition on mounting when transitionOnAppear is false', () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown" transitionOnAppear={false}><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
        })
    })

    describe('closed property', () => {
        it('sets closed class on container when mounted with closed property set', () => {
            const slidedown = enzyme.mount(<SlideDown closed={true}><div className="findme" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().classList.contains('closed')).to.be.true
            const slidedown2 = enzyme.mount(<SlideDown closed={false}><div className="findme" /></SlideDown>, { attachTo })
            expect(slidedown2.find('.react-slidedown').getDOMNode().classList.contains('closed')).to.be.false
        })

        it('renders children when closed property is set', () => {
            const slidedown = enzyme.mount(<SlideDown closed={true}><div className="findme" /></SlideDown>, { attachTo })
            expect(slidedown.find('.findme')).to.have.length(1)
        })

        it('does not transition on mounting when closed property is set', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown" closed={true}><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
            await pause(110)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
        })

        it('transitions when closed property is updated to false', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown" closed={true}><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
            slidedown.setProps({ closed: false })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
            await pause(110)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
        })

        it('transitions when closed property is updated to true', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown" closed={false} transitionOnAppear={false}><div className="test-content" /></SlideDown>, { attachTo })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
            slidedown.setProps({ closed: true })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(18)
            await pause(110)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
        })

        it('reverses transition when closed property is set half-way through opening', async () => {
            const slidedown = enzyme.mount(<SlideDown className="test-slidedown"><div className="test-content" /></SlideDown>, { attachTo })
            await pause(50)
            const midHeight = slidedown.find('.react-slidedown').getDOMNode().clientHeight
            expect(midHeight).to.be.lessThan(18)

            slidedown.setProps({ closed: true })
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(midHeight)
            await pause(50)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.be.lessThan(midHeight)
            await pause(60)
            expect(slidedown.find('.react-slidedown').getDOMNode().clientHeight).to.equal(0)
        })
    })

    describe('react-test-renderer', () => {
        it('supports mounting', () => {
            const testRenderer = TestRenderer.create(<SlideDown>slideme</SlideDown>)
            expect(testRenderer.toJSON().type).to.equal('div')
            expect(testRenderer.toJSON().props.className).to.equal('react-slidedown')
        })

        it('supports updating', () => {
            const testRenderer = TestRenderer.create(<SlideDown>slideme</SlideDown>)
            testRenderer.update(<SlideDown>slideme</SlideDown>)
            expect(testRenderer.toJSON().type).to.equal('div')
            expect(testRenderer.toJSON().props.className).to.equal('react-slidedown')
        })

        it('supports unmounting', () => {
            const testRenderer = TestRenderer.create(<SlideDown>slideme</SlideDown>)
            testRenderer.unmount()
            expect(testRenderer.toJSON()).to.be.null
        })
    })
})