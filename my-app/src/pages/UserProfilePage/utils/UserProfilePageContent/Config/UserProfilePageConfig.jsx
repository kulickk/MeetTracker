import styles from './UserProfilePageConfig.module.css'


const Config = (props) => {
    return (
        <div className={ styles.content }>
            <label className={ styles.configFormLabel } htmlFor="config-node">
                <p className={ styles.configFormLabelTitle }>Узел LLM модели</p>
                <input className={ styles.configFormLabelInput } id="config-node" type="text" placeholder="Введите узел..." autoComplete='off'/>
            </label>
            <button className={ `admin-panel-button user-button ${styles.saveChangesButton}` }>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13Z" fill="#282828"/>
                    <path d="M7 1C7 0.447715 7.44772 0 8 0H10C10.5523 0 11 0.447715 11 1V3H7V1Z" fill="#282828"/>
                    <path d="M15 11V7H17C17.5523 7 18 7.44772 18 8V10C18 10.5523 17.5523 11 17 11H15Z" fill="#282828"/>
                    <path d="M1 11C0.447715 11 0 10.5523 0 10V8C0 7.44772 0.447715 7 1 7H3V11H1Z" fill="#282828"/>
                    <path d="M7 15H11V17C11 17.5523 10.5523 18 10 18H8C7.44772 18 7 17.5523 7 17V15Z" fill="#282828"/>
                    <path d="M12 14.8284L14.8284 12L16.2426 13.4142C16.6332 13.8047 16.6332 14.4379 16.2426 14.8284L14.8284 16.2426C14.4379 16.6332 13.8047 16.6332 13.4142 16.2426L12 14.8284Z" fill="#282828"/>
                    <path d="M1.70711 4.53553C1.31658 4.14501 1.31658 3.51184 1.70711 3.12132L3.12132 1.70711C3.51184 1.31658 4.14501 1.31658 4.53553 1.70711L5.94975 3.12132L3.12132 5.94975L1.70711 4.53553Z" fill="#282828"/>
                    <path d="M13.4142 1.70711C13.8047 1.31658 14.4379 1.31658 14.8284 1.70711L16.2426 3.12132C16.6332 3.51184 16.6332 4.14501 16.2426 4.53553L14.8284 5.94975L12 3.12132L13.4142 1.70711Z" fill="#282828"/>
                    <path d="M3.12132 12L5.94975 14.8284L4.53553 16.2426C4.14501 16.6332 3.51184 16.6332 3.12132 16.2426L1.70711 14.8284C1.31658 14.4379 1.31658 13.8047 1.70711 13.4142L3.12132 12Z" fill="#282828"/>
                </svg>

                Сохранить изменения
            </button>
        </div>
    );
};

export default Config;