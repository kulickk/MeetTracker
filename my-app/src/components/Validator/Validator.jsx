import React, { Children } from "react";
import styles from './Validator.module.css'


const replaceButton = (obj, target, newFunction) => {
    if (Array.isArray(obj)) {
        return obj.map((element) => replaceButton(element, target));
    } else if (typeof obj === 'object') {
        if (Object.keys(obj.props).includes('name')) {
            if (obj.props.name === target) {
                console.log('clone');
                return React.cloneElement(obj, {onClick: newFunction})
            }
        }
        if (Object.keys(obj.props).includes('children')) {
            console.log('CHILDREN', obj.props.children);
            const result = findSubmitter(obj.props.children, target);
            if (result) {
                console.log("RESULT", result);
                return result;
            }
        }
    }
    return obj;
};

const findSubmitter = (obj, target) => {
    if (Array.isArray(obj)) {
        console.log('ARRAY');
        return obj.map((element) => {
            const result = findSubmitter(element, target);
            if (result) return result;
        });
    } else if (typeof obj === 'object') {
        // console.log(obj, target);
        if (Object.keys(obj.props).includes('name')) {
            console.log('OBJECT');
            if (obj.props.name === target) {
                console.log('Submitter finded');
                return obj;
            }
        }
        // console.log("OBJECT KEYS", Object.keys(obj.props));
        if (Object.keys(obj.props).includes('children')) {
            console.log('CHILDREN', obj.props.children);
            const result = findSubmitter(obj.props.children, target);
            if (result) {
                console.log("RESULT", result);
                return result;
            }
        }
    }
    return null;
};

const ValidatorComponent = (props) => {
    const form = props.children.props;
    // console.log(form);
    // const submitter = Array.from(form.children).filter((element) => {
    //     if (element.type === 'button' && element.props.name === 'submitter') {
    //         return element;
    //     }
    // })[0];
    const submitter = findSubmitter(form.children, 'submitter');
    console.log('Submitter', submitter);
    // console.log(form);
    // console.log(submitter);
    // console.log(Object.keys(props.validate));
    // console.log(/^[A-Za-z]+@[a-z]+\.[a-z]+/.test('Pochta@mail.ru'));

    const handleValidateOnClick = (e) => {
        e.preventDefault();
        console.log('VALIDATE');
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


    // const modifiedChildren = Children.map(form.children, (child) => {
    //     if (child.type === 'button') {
    //         return React.cloneElement(child, {
    //             onClick: handleValidateOnClick
    //         });
    //     };
    //     return child;
    // })
    // console.log(modifiedChildren);
    // submitter = React.cloneElement(submitter, {onClick: handleValidateOnClick});
    const modifiedChildren = replaceButton(form.children, 'submitter', handleValidateOnClick);
    return(
        <form className={ form.className } children={ modifiedChildren }></form>
    );
};

export default ValidatorComponent;