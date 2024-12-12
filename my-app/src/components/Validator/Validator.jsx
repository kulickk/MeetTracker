import React, { Children } from "react";
import styles from './Validator.module.css'


const ValidatorComponent = (props) => {
    const form = props.children.props;
    const submitter = form.children[Children.count(form.children) - 1];
    // console.log(form);
    // console.log(submitter);
    // console.log(Object.keys(props.validate));
    // console.log(/^[A-Za-z]+@[a-z]+\.[a-z]+/.test('Pochta@mail.ru'));

    const handleValidateOnClick = (e) => {
        e.preventDefault();
        const checkValidate = Object.keys(props.validate).map((key) => {
            const input = document.getElementById(key);
            const messageElement = document.getElementById(key + '-message');
            const message = props.validate[key].valid[0].message;
            const regex = props.validate[key].valid[0].regex;

            if (regex) {
                if (regex.test(input.value)) {
                    return 1;
                }
                input.classList.add('inputValidationError');
                messageElement.classList.remove('hidden');
                messageElement.textContent = message;
                return 0;
            }
            return 1;
        });
        
        let sum = 0;
        checkValidate.forEach((element) => sum += element);

        if (sum === checkValidate.length) {
            submitter.props.onClick();
        }
        else {

        }
    };


    const modifiedChildren = Children.map(form.children, (child) => {
        if (child.type === 'button') {
            return React.cloneElement(child, {
                onClick: handleValidateOnClick
            });
        };
        return child;
    })

    return(
        <form className={ form.className } children={ modifiedChildren }></form>
    );
};

export default ValidatorComponent;