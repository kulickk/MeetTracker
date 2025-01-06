// const validate = {
//     'element_id': {
//         *$valid: [
//             {
//                 *$regex: /[А-Я][а-я]+/,
//                 *$message: 'Нужно ввести фамилию'
//             }
//         ],
//         *$params: {
//             *$requered: false
//         }
//     }
// };
// * - точное название поля
// $ - может отсутствовать


const validateForm = (form, validate) => {
    const checkValidate = Object.keys(validate).map((key) => {
        const params = (validate[key]['params']) ? validate[key]['params']: null;
        const input = document.getElementById(key);
        if (params) {
            if (!params.requered && input.value.length === 0) {
                return 1;
            }
        };
        const messageElement = document.getElementById(key + '-message');
        const validUtils = validate[key].valid;
        if (validUtils) {
            const message = validate[key].valid[0].message;
            const regex = validate[key].valid[0].regex;
    
            if (regex) {
                if (regex.test(input.value)) {
                    return 1;
                }
                input.classList.add('inputValidationError');
                if (messageElement) {
                    messageElement.classList.remove('hidden');
                    messageElement.textContent = message;
                }
                return 0;
            }
            return 1;
        }
        return 1;
    });

    let sum = 0;
    checkValidate.forEach((element) => sum += element);

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