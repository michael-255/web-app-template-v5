import Setting from '@/models/Setting'
import { SettingIdEnum } from '@/shared/enums'
import { describe, expect, it } from 'vitest'

describe('Setting class', () => {
    it('should have expected properties', () => {
        const model = new Setting(SettingIdEnum.CONSOLE_LOGS, true)
        expect(model).toEqual(
            expect.objectContaining({
                id: SettingIdEnum.CONSOLE_LOGS,
                value: true,
            }),
        )
        expect(Object.keys(model)).toHaveLength(2)
    })
})
