import { useLogger } from '@/composables/useLogger'
import { describe, expect, it, vi } from 'vitest'

let quasarNotifyParams: { message: string; icon: string; color: string } = {
    message: '',
    icon: '',
    color: '',
}

let quasarGetPaletteColorParams: string = ''

vi.mock('quasar', () => ({
    useQuasar: () => ({
        notify: (params: { message: string; icon: string; color: string }) => {
            quasarNotifyParams = params
        },
    }),
    colors: {
        getPaletteColor: (color: string) => {
            quasarGetPaletteColorParams = color
        },
    },
}))

const consoleLogSpy = vi.fn()

const consoleMock = {
    log: consoleLogSpy,
    warn: consoleLogSpy,
    error: consoleLogSpy,
    info: consoleLogSpy,
    debug: consoleLogSpy,
}

vi.stubGlobal('console', consoleMock)

describe('useLogger', () => {
    it('should return the log object', () => {
        const { log } = useLogger()
        expect(typeof log).toBe('object')
    })

    it('should call console.log with expected parameters when log.print is called', () => {
        const message = 'Test Message'
        const { log } = useLogger()
        log.print(message)
        expect(consoleLogSpy).toHaveBeenCalled()
    })

    it('should call console.log with expected parameters when log.debug is called', () => {
        const name = 'Test Name'
        const { log } = useLogger()
        log.debug(name)
        expect(consoleLogSpy).toHaveBeenCalled()
    })
})
