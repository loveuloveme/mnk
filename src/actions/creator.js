import actions from './index';

export function setWorkbook(workbook){
    return {
        type: actions.SET_WORKBOOK,
        workbook: workbook
    }
}

export function setList(list){
    return {
        type: actions.SET_LIST,
        list: list
    }
}

export function setX(value){
    return {
        type: actions.SET_X,
        value: value
    }
}

export function setY(value){
    return {
        type: actions.SET_Y,
        value: value
    }
}