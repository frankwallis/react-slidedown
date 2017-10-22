import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import { expect } from 'chai'
import { SlideIn } from '../lib/slidein'

/* Configure enzyme */
enzyme.configure({ adapter: new Adapter() });

/* Workaround for Karma bug #636 */
const links = document.getElementsByTagName('link');
for (var i = 0; i < links.length; i ++)
    document.head.appendChild(links[i]);
    
/* async/await sleep */
function pause(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

describe('SlideIn', () => {
    let attachTo = null;

    beforeEach(() => {
        if (attachTo) {
            ReactDOM.unmountComponentAtNode(attachTo);
        }
        else {
            attachTo = document.createElement('div');
            document.body.appendChild(attachTo);
        }
    });

    describe('Simple rendering', () => {
        it('renders no children when empty', () => {
            const slidein = enzyme.render(<SlideIn></SlideIn>);
            expect(slidein.children()).to.have.length(0);
        })

        it('renders content when present', () => {
            const slidein = enzyme.render(<SlideIn>findme</SlideIn>);
            expect(slidein.text()).to.equal('findme');
        })

        it('renders container div with class react-slidein', () => {
            const slidein = enzyme.render(<SlideIn>anything</SlideIn>);
            expect(slidein.hasClass('react-slidein')).to.be.true;
        })

        it('adds className property to container', () => {
            const slidein = enzyme.render(<SlideIn className={'my-class'}>slideme</SlideIn>);
            expect(slidein.hasClass('react-slidein')).to.be.true;
            expect(slidein.hasClass('my-class')).to.be.true;
        })
    });

    describe('children', () => {        
        it('transitions when children are added', async () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'}></SlideIn>, { attachTo });
            slidein.setProps({ children: <div className={'test-content'} /> });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
            await pause(100);
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
        })

        it('transitions when children are removed', async () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'} transitionOnAppear={false}><div className={'test-content'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
            slidein.setProps({ children: null });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
            await pause(100);
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
        })
    });

    describe('transitionOnAppear', () => {        
        it('transitions on mounting', async () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'}><div className={'test-content'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
            await pause(100);
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
        })

        it('does not transition on mounting when transitionOnAppear is false', () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'} transitionOnAppear={false}><div className={'test-content'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
        })
    });

    describe('Closed property', () => {        
        it('sets closed class on container when mounted with closed property set', () => {
            const slidein = enzyme.mount(<SlideIn closed={true}><div className={'findme'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().classList.contains('closed')).to.be.true;
            const slidein2 = enzyme.mount(<SlideIn closed={false}><div className={'findme'} /></SlideIn>, { attachTo });
            expect(slidein2.find('.react-slidein').getDOMNode().classList.contains('closed')).to.be.false;
        })

        it('renders children when closed property is set', () => {
            const slidein = enzyme.mount(<SlideIn closed={true}><div className={'findme'} /></SlideIn>, { attachTo });
            expect(slidein.find('.findme')).to.have.length(1);
        })

        it('does not transition on mounting when closed property is set', async () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'} closed={true}><div className={'test-content'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
            await pause(100);
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
        })

        it('transitions when closed property is updated to false', async () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'} closed={true}><div className={'test-content'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
            slidein.setProps({ closed: false });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
            await pause(100);
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
        })

        it('transitions when closed property is updated to true', async () => {
            const slidein = enzyme.mount(<SlideIn className={'test-slidein'} closed={false} transitionOnAppear={false}><div className={'test-content'} /></SlideIn>, { attachTo });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
            slidein.setProps({ closed: true });
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(18);
            await pause(100);
            expect(slidein.find('.react-slidein').getDOMNode().clientHeight).to.equal(0);
        })
    });
})