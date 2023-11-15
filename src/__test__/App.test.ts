import { shallowMount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.vue'

// Required for these spys to work with vi.mock()
const spys = vi.hoisted(() => ({
    notifySpy: vi.fn(),
    getPaletteColorSpy: vi.fn(),
    initSettingsSpy: vi.fn(),
    purgeLogsSpy: vi.fn(),
    consoleLogSpy: vi.fn(),
    consoleWarnSpy: vi.fn(),
    consoleErrorSpy: vi.fn(),
}))

vi.mock('quasar', () => ({
    useQuasar: () => ({
        notify: spys.notifySpy,
    }),
    useMeta: vi.fn(),
    colors: {
        getPaletteColor: spys.getPaletteColorSpy,
    },
}))

vi.mock('../services/Database.ts', () => ({
    default: {
        initSettings: spys.initSettingsSpy,
        purgeLogs: spys.purgeLogsSpy,
    },
}))

vi.stubGlobal('console', {
    log: spys.consoleLogSpy,
    warn: spys.consoleWarnSpy,
    error: spys.consoleErrorSpy,
})

describe('App', () => {
    it('should match the snapshot', () => {
        spys.initSettingsSpy.mockResolvedValueOnce([])
        spys.purgeLogsSpy.mockResolvedValueOnce(0)
        const wrapper = shallowMount(App)
        expect(wrapper.html()).toMatchSnapshot()
    })

    // it('updates the message when the button is clicked', async () => {
    //     const wrapper = shallowMount(App)
    //     const button = wrapper.find('button')
    //     await button.trigger('click')
    //     expect(wrapper.text()).toMatch('Button clicked!')
    // })
})
