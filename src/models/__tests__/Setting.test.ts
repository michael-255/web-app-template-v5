import Setting from '@/models/Setting'
import { SettingKeyEnum } from '@/shared/enums'
import { describe, expect, it } from 'vitest'

describe('Setting class', () => {
    it('should have expected properties', () => {
        const model = new Setting(SettingKeyEnum.CONSOLE_LOGS, true)
        expect(model).toEqual(
            expect.objectContaining({
                key: SettingKeyEnum.CONSOLE_LOGS,
                value: true,
            }),
        )
    })
})
