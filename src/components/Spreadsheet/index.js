import { useEffect, useRef, useState, useCallback } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { useDispatch, useSelector } from 'react-redux';

import {Button} from 'react-bootstrap';

import XLSX from 'xlsx';
import ReactDataSheet from 'react-datasheet';

import {setWorkbook, setList} from '../../actions/creator';

import {lettersToNumber, numberToLetters, parsePosition} from '../../util';

import 'react-datasheet/lib/react-datasheet.css';
import './index.scss';

function Spreadsheet({onSelect, disabled}){
    const inputRef = useRef();

    //const {width, height, ref} = {width: 300, height: 500, ref :useRef()};
    const {width, height, ref} = useResizeDetector();

    const workbook = useSelector(state => state.workbook);
    const list = useSelector(state => state.list);

    const [data, setData] = useState([[]]);

    const dispatch = useDispatch();

    useEffect(() => {
        

        let insertData = () => {
            if(workbook === null) return;

            let sheet = workbook.Sheets[list !== '' ? list : workbook.SheetNames[0]];
    
            let endStr = sheet['!ref'].split(':')[1];
    
            let end = {
                letter: parsePosition(endStr)[0],
                number: parsePosition(endStr)[1],
            }
    
            let table = new Array(parseInt(end.number)).fill(0);
    
            table.forEach((item, index) => {
                table[index] = new Array(lettersToNumber(end.letter)).fill({});
            });
    
            for(var item in sheet){
                if(!item.search('!')) continue;
                let pos = parsePosition(item);
    
                let x = lettersToNumber(pos[0]) - 1;
                let y = parseInt(pos[1]) - 1;
    
                table[y][x] = {
                    value: "" + sheet[item].v
                };
            }
    
            setData(table);
        };

        insertData();
    }, [list, workbook]);

    let upload = event => {
        let file = event.target.files[0];

        if(file.name.split('.')[file.name.split('.').length - 1] !== 'xlsx'){
            alert('Неподдерживаемый формат');
            return;
        }

        var fileReader = new FileReader();

        fileReader.onload = function(e) { 
            var contents = e.target.result;

            const workbook = XLSX.read(contents, {type:'binary'});

            dispatch(setWorkbook(workbook));
            dispatch(setList(workbook.SheetNames[0]));
        }

        fileReader.readAsBinaryString(file);
    };

    
    let renderTable = useCallback(() => {
        let dataExtended = [...data];
        for (var i = 0; i < data.length; i++)
            dataExtended[i] = data[i].slice();

        while((dataExtended.length+1)*33 < height){
            dataExtended.push([]);
        }

        dataExtended.forEach((item, index) => {
            while((item.length)*100 < width){
               item.push({value: ''});
            }
        });

        let columns = [{ readOnly: true, value: '' }];

        dataExtended[0].forEach((item, index) => columns.push({ value: numberToLetters(index), readOnly: true }));
        dataExtended.unshift(columns);
        dataExtended.forEach((item, index) => {
            if(index === 0) return;

            item.unshift({ value: index, readOnly: true })
        });
        
        return dataExtended;
    }, [data, width, height]);

    return (
        <div className="spreadsheet">
            {workbook != null ? 
                <div ref={ref} className="spreadsheet__data"    >
                    <span style={disabled ? {pointerEvents: 'none'} : {}}>
                        <ReactDataSheet
                            data={renderTable()}
                            valueRenderer={(cell) => cell.value}
                            onSelect={onSelect}
                        />
                    </span>
                </div>
                :
                <div className="uploadFile">
                    <div>
                        <h1>Выберете необходимый<br/>файл формата <span>.xlsx</span></h1>
                        <Button
                            variant="primary"
                            onClick={() => inputRef.current.click()}
                        >
                            Выбрать файл
                        </Button>
                        <input
                            ref={inputRef}
                            id="fileInput"
                            type="file"
                            name="myFile"
                            onChange={upload}
                        />
                    </div>
                </div>
            }
        </div>
    );
}

export default Spreadsheet;