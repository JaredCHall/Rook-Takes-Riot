export default class StateMutation {

    oldValue: string|null

    newValue: string|null

    propertyName: string

    constructor(propertyName: string, oldValue:string|null, newValue:string|null) {
        this.propertyName = propertyName
        this.oldValue = oldValue === '' ? null : oldValue
        this.newValue = newValue === '' ? null : newValue

        if(this.#allowedProperties().indexOf(this.propertyName) === -1){
            throw new Error('Property cannot be mutated with this class: ' + this.propertyName)
        }
    }

    #allowedProperties(): string[] {
        return [
            'enPassantTarget',
            'castleRights'
        ]
    }
}