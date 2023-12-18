import { createTestingPinia } from '@pinia/testing'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App.vue'

// Required for these spys to work with vi.mock()
const spys = vi.hoisted(() => ({
    useMeta: vi.fn(),
    notify: vi.fn(),
    initSettings: vi.fn(),
    purgeLogs: vi.fn(),
    logSilentDebug: vi.fn(),
    logError: vi.fn(),
}))

vi.mock('quasar', () => ({
    useMeta: spys.useMeta,
    useQuasar: () => ({
        notify: spys.notify,
    }),
    colors: {
        getPaletteColor: vi.fn(), // So useMeta test won't break
    },
}))

vi.mock('../services/Database.ts', () => ({
    default: {
        initSettings: spys.initSettings,
        purgeLogs: spys.purgeLogs,
    },
}))

vi.mock('../composables/useLogger.ts', () => ({
    useLogger: () => ({
        log: {
            silentDebug: spys.logSilentDebug,
            error: spys.logError,
        },
    }),
}))

describe('App', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        /**
         * Will have to figure out how to fix with Pinia testing
         * @see https://pinia.vuejs.org/cookbook/testing.html
         */
        createTestingPinia()
    })

    it('should match the snapshot', () => {
        const wrapper = shallowMount(App)
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should call useMeta()', () => {
        shallowMount(App)
        expect(spys.useMeta).toHaveBeenCalledWith(
            expect.objectContaining({
                meta: expect.any(Object),
            }),
        )
    })

    it('should initialize settings on mount', async () => {
        const settings = [{ key: 'setting', value: true }]
        spys.initSettings.mockResolvedValueOnce(settings)
        shallowMount(App)
        await flushPromises()
        expect(spys.initSettings).toHaveBeenCalled()
        expect(spys.logSilentDebug).toHaveBeenCalledWith('Settings initialized', settings)
    })

    it('should purge logs on mount', async () => {
        spys.purgeLogs.mockResolvedValueOnce(0)
        shallowMount(App)
        await flushPromises()
        expect(spys.purgeLogs).toHaveBeenCalled()
        expect(spys.logSilentDebug).toHaveBeenCalledWith('Expired logs purged', { logsPurged: 0 })
    })

    it('should notify the user if initializing settings fails', async () => {
        spys.initSettings.mockImplementationOnce(() => {
            throw new Error('Test error')
        })
        shallowMount(App)
        await flushPromises()
        expect(spys.notify).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Error initializing settings',
            }),
        )
    })

    it('should error log if purge logs fails', async () => {
        const error = new Error('Test error')
        spys.purgeLogs.mockImplementationOnce(() => {
            throw error
        })
        shallowMount(App)
        await flushPromises()
        expect(spys.logError).toHaveBeenCalledWith('Error purging expired logs', error)
    })
})
