import { Setting } from '@/models'
import { Enum } from '@/shared'
import { describe, expect, it } from 'vitest'

describe('Setting class', () => {
    it('should have expected properties', () => {
        const model = new Setting(Enum.SettingKey.CONSOLE_LOGS, true)
        expect(model).toHaveProperty('key')
        expect(model).toHaveProperty('value')
    })
})
