export const callMutation = async (argsObject, mutation) => {
    return mutation({ variables: argsObject })
}