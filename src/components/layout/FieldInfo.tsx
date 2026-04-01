import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em className="text-error text-sm">
                    {field.state.meta.errors.map(e => e.message).join(', ')}
                </em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}