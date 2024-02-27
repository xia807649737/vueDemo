/*
 * @Description: 
 * @Author: Xu.L
 * @Date: 2023-04-20 16:13:32
 */

import Quill from 'quill'
 
const BlockEmbed = Quill.import('blots/block')
const Link = Quill.import('formats/link')
 
class Audio extends BlockEmbed {
    static create(value) {
        const node = super.create(value)
        node.setAttribute('controls', 'controls')
        node.setAttribute('src', this.sanitize(value))
        node.setAttribute('controlsList', 'nodownload');
        return node
    }
 
    static sanitize(url) {
        return Link.sanitize(url)
    }
 
    static value(domNode) {
        return domNode.getAttribute('src')
    }
 
    format(name, value) {
        super.format(name, value)
    }
 
}
Audio.blotName = 'audio'
Audio.className = 'ql-audio'
Audio.tagName = 'audio'
 
