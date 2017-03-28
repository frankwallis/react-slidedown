import * as React from 'react'
import * as enzyme from 'enzyme'
import { SlideIn } from '../lib/slidein'
import { expect } from 'chai'
import 'es6-promise/auto'

function pause(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

describe('SlideIn', () => {
    it('renders nothing when empty', () => {
        const slidein = enzyme.mount(<SlideIn></SlideIn>);
        expect(slidein.children()).to.have.length(0);
    })

    it('renders a div with class react-slidein', () => {
        const slidein = enzyme.mount(<SlideIn>slideme</SlideIn>);
        expect(slidein.hasClass('react-slidein')).to.be.true;
    })

    it('adds className property', () => {
        const slidein = enzyme.mount(<SlideIn className={'my-class'}>slideme</SlideIn>);
        expect(slidein.hasClass('react-slidein')).to.be.true;
        expect(slidein.hasClass('my-class')).to.be.true;
    })

    xit('animates height when child is inserted', async () => {
        const slidein = enzyme.mount(<SlideIn></SlideIn>, { attachTo: document.body });
        const fixedHeightDiv = <div style={{ 'minHeight': '200px' }}></div>;
        slidein.setProps({ children: fixedHeightDiv });
        expect(slidein.getDOMNode().style.height).to.be.equal('200px');
        await pause(600);
        expect(slidein.getDOMNode().style.height).to.be.equal('auto');
    })
})