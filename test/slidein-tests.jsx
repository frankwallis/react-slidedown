import 'core-js/shim'
import * as React from 'react'
import * as enzyme from 'enzyme'
import { SlideIn } from '../lib/slidein'
import { expect } from 'chai'

function pause(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

describe('SlideIn', () => {
    it('renders no children when empty', () => {
        const slidein = enzyme.mount(<SlideIn></SlideIn>);
        expect(slidein.children()).to.have.length(0);
    })

    it('renders content when present', () => {
        const slidein = enzyme.mount(<SlideIn>findme</SlideIn>);
        expect(slidein.text()).to.equal('findme');
    })

    it('renders container div with class react-slidein', () => {
        const slidein = enzyme.mount(<SlideIn>anything</SlideIn>);
        expect(slidein.hasClass('react-slidein')).to.be.true;
    })

    it('adds className property to container', () => {
        const slidein = enzyme.mount(<SlideIn className={'my-class'}>slideme</SlideIn>);
        expect(slidein.hasClass('react-slidein')).to.be.true;
        expect(slidein.hasClass('my-class')).to.be.true;
    })

    it('sets closed class on container when closed property is set', async () => {
        const slidein = enzyme.mount(<SlideIn closed={true}><div className={'findme'} /></SlideIn>, { attachTo: document.body });
        expect(slidein.hasClass('closed')).to.be.true;
    })

    it('renders children when closed property is set', async () => {
        const slidein = enzyme.mount(<SlideIn closed={true}><div className={'findme'} /></SlideIn>, { attachTo: document.body });
        expect(slidein.find('.findme')).to.have.length(1);
    })

    xit('animates height when child is inserted', async () => {
        const slidein = enzyme.mount(<SlideIn style={{ transitionDuration: '.1s', transitionTimingFunction: 'ease-out' }}></SlideIn>, { attachTo: document.body });
        const fixedHeightDiv = <div style={{ 'minHeight': '200px' }}>ggg</div>;
        slidein.setProps({ children: fixedHeightDiv });
        slidein.update()
        expect(slidein.getDOMNode().style.height).to.be.equal('200px');
        await pause(1000);
        // expect(slidein.getDOMNode().style.height).to.be.equal('auto');
    })
})