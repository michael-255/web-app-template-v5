export class Example {
    constructor(
        public id: string,
        public createdAt: number,
        public name: string,
        public desc: string,
        public tags: string[],
        public data: number[],
    ) {}

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example' : 'Examples'
    }
}
