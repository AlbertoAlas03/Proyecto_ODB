const validations = () => {

    const validate_DUI = (dui_jugador) => {

        const duiRegex = /^\d{8}-\d{1}$/;

        const validate_dui = duiRegex.test(dui_jugador)

        return validate_dui
    }

    return { validate_DUI }
}

export default validations