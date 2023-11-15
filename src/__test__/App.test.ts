import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../App.vue'

describe('App', () => {
    it.skip('renders the correct message', () => {
        const wrapper = shallowMount(App)
        expect(wrapper.text()).toMatch('Welcome to my app!')
    })

    it.skip('updates the message when the button is clicked', async () => {
        const wrapper = shallowMount(App)
        const button = wrapper.find('button')
        await button.trigger('click')
        expect(wrapper.text()).toMatch('Button clicked!')
    })
})
