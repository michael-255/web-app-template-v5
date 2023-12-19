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
    subscribe: vi.fn(),
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
        liveSettings: () => ({
            subscribe: spys.subscribe,
        }),
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

/**
 * Helper that returns the wrapped component. For some tests the wrapper just needs to be
 * constructed, but isn't needed beyond that..
 */
function buildAppWrapper() {
    return shallowMount(App, {
        global: {
            plugins: [
                createTestingPinia({
                    createSpy: vi.fn(),
                    initialState: {
                        settings: [],
                    },
                }),
            ],
        },
    })
}

describe('App', () => {
    beforeEach(() => {
        vi.resetAllMocks()
    })

    it('should match the snapshot', () => {
        const wrapper = buildAppWrapper()
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should call useMeta()', () => {
        buildAppWrapper()
        expect(spys.useMeta).toHaveBeenCalledWith(
            expect.objectContaining({
                meta: expect.any(Object),
            }),
        )
    })

    it('should subscribe to live settings', async () => {
        buildAppWrapper()
        await flushPromises()
        expect(spys.subscribe).toHaveBeenCalled()
    })

    it('should initialize settings on mount', async () => {
        const settings = [{ key: 'setting', value: true }]
        spys.initSettings.mockResolvedValueOnce(settings)
        buildAppWrapper()
        await flushPromises()
        expect(spys.initSettings).toHaveBeenCalled()
        expect(spys.logSilentDebug).toHaveBeenCalledWith('Settings initialized', settings)
    })

    it('should purge logs on mount', async () => {
        spys.purgeLogs.mockResolvedValueOnce(0)
        buildAppWrapper()
        await flushPromises()
        expect(spys.purgeLogs).toHaveBeenCalled()
        expect(spys.logSilentDebug).toHaveBeenCalledWith('Expired logs purged', { logsPurged: 0 })
    })

    it('should notify the user if initializing settings fails', async () => {
        spys.initSettings.mockImplementationOnce(() => {
            throw new Error('Test error')
        })
        buildAppWrapper()
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
        buildAppWrapper()
        await flushPromises()
        expect(spys.logError).toHaveBeenCalledWith('Error purging expired logs', error)
    })
})
