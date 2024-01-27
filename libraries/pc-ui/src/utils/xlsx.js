import XLSX from 'xlsx-js-style';

export function exportExcel(aoa, sheetName, fileName, sheetTitleData, columns, hasHeader, merges, includeStyles) {
    // return;
    // 若有标题，添加标题到第一行
    const sheet = XLSX.utils.json_to_sheet([]);
    aoa.forEach((row) => {
        // 默认设置为字符串
        row.forEach((cell) => {
            cell.t = 's';
        });
    });
    // 设置列宽和行高
    if (includeStyles) {
        const cols = [];
        const rows = [];
        aoa.forEach((row, rowIndex) => {
            // 获取行高
            const heights = row.map((v) => v && v.rect && +v.rect.height).filter((v) => v !== undefined);
            const height = Math.max(...heights);
            rows[rowIndex] = { hpx: height };
        });
        if (sheetTitleData.title) {
            rows.unshift({ hpx: sheetTitleData.rect && sheetTitleData.rect.height });
        }
        // 获取列宽
        for (let i = 0; i < aoa[0].length; i++) {
            let widthResult = 0;
            for (let j = 0; j < aoa.length; j++) {
                if (aoa[j][i] && aoa[j][i].rect) {
                    const width = aoa[j][i].rect.width;
                    widthResult = Math.max(widthResult, width);
                }
            }
            cols[i] = { wpx: widthResult };
        }
        sheet['!cols'] = cols;
        sheet['!rows'] = rows;
    }
    if (sheetTitleData.title) {
        const endCell = XLSX.utils.encode_col(columns - 1) + 1;
        XLSX.utils.sheet_add_aoa(sheet, [[sheetTitleData.title]], { origin: { r: 0, c: 0 } });
        XLSX.utils.sheet_add_aoa(sheet, aoa, { origin: 'A2' });
        sheet['!merges'] = [XLSX.utils.decode_range(`A1:${endCell}`), ...merges.map((v) => ({
            s: {
                c: v.col,
                r: v.row + 1,
            },
            e: {
                c: v.col + v.colspan - 1,
                r: v.row + 1 + v.rowspan - 1,
            },
        }))];
        // 设置标题样式
        sheet.A1.s = sheetTitleData.s;
    } else {
        XLSX.utils.sheet_add_aoa(sheet, aoa, { origin: 'A1' });
        sheet['!merges'] = merges.map((v) => ({
            s: {
                c: v.col,
                r: v.row,
            },
            e: {
                c: v.col + v.colspan - 1,
                r: v.row + v.rowspan - 1,
            },
        }));
    }
    // 将文本格式的内容，转化为日期和数字格式
    Object.keys(sheet).forEach((item) => {
        const cell = sheet[item];
        const dateRegx = /^\d{4}-\d{2}-\d{2}$/;
        const percentRegx = /^\d+(\.\d+)?%$/;
        const excludeNumberRegx = /^0\d+$/;
        const value = cell.v;
        let template;
        if (cell.t === 's' && value !== '%' && percentRegx.test(value)) {
            // 根据小数位数转化为'0.00%'格式，比如一位小数就是'0.0%'
            if (value.indexOf('.') > -1) {
                const percentLength = value.split('.')[1].length;
                template = '0.' + new Array(percentLength - 1).fill(0).join('') + '%';
            } else {
                template = '0%';
            }
            cell.z = template;
            cell.t = 'n';
            cell.v = Number(value.substring(0, value.length - 1)) / 100;
        } else if (!isNaN(Number(value)) && value.length <= 15) {
            // 0开头的数字字符串，比如'001234'，不会被转化为数字
            if (excludeNumberRegx.test(value))
                return;
            if (value.indexOf('.') > -1) {
                const percentLength = value.split('.')[1].length;
                template = '0.' + new Array(percentLength).fill(0).join('');
            } else {
                template = '0';
            }
            cell.z = template;
            cell.t = 'n';
        } else if (dateRegx.test(value)) {
            cell.t = 'd';
        }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, sheetName);
    const workbookBlob = workbook2blob(wb);
    openDownload(workbookBlob, `${fileName}.xlsx`);
}
function openDownload(blob, fileName) {
    if (typeof blob === 'object' && blob instanceof Blob) {
        blob = URL.createObjectURL(blob);
    }
    const aLink = document.createElement('a');
    aLink.href = blob;
    aLink.download = fileName || '';
    const event = new MouseEvent('click');
    aLink.dispatchEvent(event);
}
function workbook2blob(workbook) {
    const wopts = {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary',
    };
    const wbout = XLSX.write(workbook, wopts);

    // 将字符串转ArrayBuffer
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i)
            view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    }

    const blob = new Blob([s2ab(wbout)], {
        type: 'application/octet-stream',
    });
    return blob;
}
