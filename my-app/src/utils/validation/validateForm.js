// const validate = {
//     'element_id': {
//         *$valid: [
//             {
//                 *$regex: /[А-Я][а-я]+/,
//                 *$message: 'Нужно ввести фамилию'
//             }
//         ],
//         *$params: {
//             *$requered: false,
//             *$requeredFor: 'tag-id',
//             *$requeredIn: 'tag-id',
//         }
//     }
// };
// * - точное название поля
// $ - может отсутствовать

const validateElement = (key, element, validate) => {
    const messageElement = document.getElementById(key + '-message');
    const validUtils = validate[key].valid;
    if (validUtils) {
        const message = validate[key].valid[0].message;
        const regex = validate[key].valid[0].regex;

        if (regex) {
            if (regex.test(element.value)) {
                return 1;
            }
            element.classList.add('inputValidationError');
            if (messageElement) {
                messageElement.classList.remove('hidden');
                messageElement.textContent = message;
            }
            return 0;
        }
        return 1;
    }
    return 1;
};


const validateForm = (form, validate) => {
    let emptyInputs = 0;
    const checkValidate = Object.keys(validate).map((key) => {
        const params = (validate[key]['params']) ? validate[key]['params']: null;
        const input = form.querySelector(`#${key}`);
        if (input.value.length === 0) {
            emptyInputs += 1;
        }
        if (params) {
            if (!params.requered && input.value.length === 0) {
                return 1;
            }
            if (params.requeredIn) {
                const requeredInInput = form.querySelector(`#${params.requeredIn}`);
                if (requeredInInput) {
                    const result = validateElement(key, input, validate);
                    if (result) {
                        return validateElement(params.requeredIn, requeredInInput, validate);
                    }
                }
            }
            // if (params.requeredFor) {
            //     const requeredForInput = form.querySelector(`#${params.requeredIn}`);
            //     if (requeredForInput) {
            //         const result = validateElement(key, input, validate);
            //         if (result) {
            //             return validateElement(params.requeredIn, requeredForInput, validate);
            //         }
            //     }
            // }
        };
        return validateElement(key, input, validate);
    });

    let sum = 0;
    checkValidate.forEach((element) => sum += element);

    if (sum === emptyInputs) {
        return false
    }
    if (sum === checkValidate.length) {
        return true;
    }
    return false;
};

const onChangeValidatedInput = (target) => {
    if (target.classList.contains('inputValidationError')) {
        target.classList.remove('inputValidationError');
        document.getElementById(target.id + '-message').classList.add('hidden');
    }
};

export { validateForm, onChangeValidatedInput };