const FROM = 0;
const TO = 1;
const PROM = 2;
const FREQ = 3;
const PROM_FREQ = 4;
const PROM_XMEDIA = 5;
const PROM_XMEDIA_FREQ = 6;



class Stats {
    constructor() {
        this.quantData = 0;
        this.listData = [];
        this.freqTable = [];

        this.intervals = 0;
        this.min = 0;
        this.intervalSize = 0;

        this.sumFreqs = 0;
        this.sumProm_xMediaPerFreq = 0;
        this.xMedia = 0;
        this.type = null;
    }

    moda() {
        let array = this.listData;
        let repetidos = [];
        array.forEach(function (numero) {
            repetidos[' ' + String(numero)] = (repetidos[' ' + String(numero)] || 0) + 1;
        });

        let max = 0;
        let value = '';
        for (var key in repetidos) {
            if (repetidos[key] > max) {
                max = repetidos[key];
                value = key;
            }
        }
        let modas = []
        for (var key in repetidos) {
            if (repetidos[key] == max) {
                modas.push(parseFloat(key));
            }
        }

        if (modas.length == this.quantData) {
            return 'No existe moda';
        } else {
            return modas.join(' | ');
        }

    }

    media() {
        let res = 0;
        for (let i = 0; i < this.quantData; i++) {
            res += this.listData[i];
        }

        return res / this.quantData;
    }

    mediana() {
        console.log(this.quantData, 'mod', 2, this.quantData % 2);
        if (this.quantData % 2 != 0) {//si la cantidad de datos es impar
            return this.listData[parseInt(this.quantData / 2)];
        } else {//si la cantidad de datos es par
            return (this.listData[parseInt(this.quantData / 2 - 1)] + this.listData[parseInt(this.quantData / 2)]) / 2;
        }
    }

    setIntervalsData(intervals) {
        this.intervals = intervals;
        // let size = this.listData[this.listData.length-1] - this.listData[0];
        // let intervalSize = parseFloat(size) / parseFloat(this.intervals);
        this.intervalSize = parseInt((this.listData[this.listData.length - 1] - this.listData[0]) / this.intervals) + 2;
        this.min = parseInt(this.listData[0]) - 1;
        //this.min=this.listData[0] % this.intervalSize

    }

    setFreqTable() {

        for (let i = 0; i < this.intervals; i++) {
            this.freqTable[i] = [
                this.min + this.intervalSize * i,
                this.min + this.intervalSize * (i + 1),
                (parseFloat(this.min + this.intervalSize * i) + parseFloat(this.min + this.intervalSize * (i + 1))) / 2
            ];
        }

        let counter = [];

        for (let j = 0; j < this.freqTable.length; j++) {
            counter[j] = 0;
            for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i] >= this.freqTable[j][0] && this.listData[i] < this.freqTable[j][1]) {
                    counter[j] > 0 ? counter[j]++ : counter[j] = 1;
                }
                if (this.listData[i] > this.freqTable[j][1]) {

                    break;
                }
            }
        }

        this.sumFreqs = 0;
        let sumPromsPerFreq = 0;
        for (let i = 0; i < this.intervals; i++) {
            this.freqTable[i][FREQ] = counter[i];
            this.freqTable[i][PROM_FREQ] = this.freqTable[i][PROM] * this.freqTable[i][FREQ];

            this.sumFreqs += this.freqTable[i][FREQ];
            sumPromsPerFreq += this.freqTable[i][PROM_FREQ];
        }
        console.log('sumFreqs', this.sumFreqs);
        console.log('sumPromsPerFreq', sumPromsPerFreq);

        this.xMedia = parseFloat(sumPromsPerFreq) / parseFloat(this.sumFreqs);
        console.log('xMedia', this.xMedia);

        this.sumProm_xMediaPerFreq = 0;
        for (let i = 0; i < this.intervals; i++) {
            this.freqTable[i][PROM_XMEDIA] = Math.pow(this.freqTable[i][PROM] - this.xMedia, 2);
            this.freqTable[i][PROM_XMEDIA_FREQ] = this.freqTable[i][PROM_XMEDIA] * this.freqTable[i][FREQ];
            this.sumProm_xMediaPerFreq += this.freqTable[i][PROM_XMEDIA_FREQ];
        }
    }

    varianza() {
        return this.sumProm_xMediaPerFreq / (this.type == 'sample' ? this.sumFreqs - 1 : this.sumFreqs);
    }

    desviacion() {
        return Math.sqrt(this.varianza());
    }

    factorVariacion() {
        return this.desviacion() / this.xMedia;
    }

    printTable() {
        console.log('PRINTING');
        let html = '';

        for (let i = 0; i < this.freqTable.length; i++) {
            html += '<tr>';
            //for (let j = 0; j < this.freqTable[i].length; j++) {
            html += '<td>' + this.freqTable[i][FROM] + ' - ' + this.freqTable[i][TO] + '</td>';
            html += '<td>' + this.freqTable[i][PROM] + '</td>';
            html += '<td>' + this.freqTable[i][FREQ] + '</td>';
            // }
            html += '</tr>';
        }
        return html;
    }


    bubbleSort(list) {

        let n = list.length;
        let temp = 0;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (list[i] > list[j]) {
                    temp = list[i];
                    list[i] = list[j];
                    list[j] = temp;
                }
            }
        }

        return list;
    }
}

function inQuantData() {
    if ($('#quantDataTxt').val() == '') {
        alert("Ingrese la cantidad de datos a analizar");
    } else if ($('#quantIntervalTxt').val() == '') {
        alert("Ingrese la cantidad de intervalos a analizar");
    } else if (parseInt($('#quantIntervalTxt').val()) >= parseInt($('#quantDataTxt').val())) {
        alert("La cantidad de intervalos debe ser menor que la cantidad de datos.");
    } else {
        stats.quantData = parseInt($('#quantDataTxt').val());
        generateList();
        $('#quantDataTxt').attr("readonly", true);
        $('#quantIntervalTxt').attr("readonly", true);
        $('#typeDiv').show();
        $('#resBtn').show();
    }
}

function generateList() {
    //alert("generando lista", stats.quantData);
    html = "<p class='mt-4'>Ingrese los datos</p>";
    for (let i = 0; i < stats.quantData; i++) {
        html += '<div class="form-group">' +
            '<input type="number" name="list_' + i + '" id="list_' + i + '" class="form-control" value="" autocomplete="off">' +
            '</div>'
    }

    $('#listFields').html(html);

    $('#mediaString').html('');
    $('#modaString').html('');
    $('#medianaString').html('');
}

function saveData() {
    let valid = true;
    for (let i = 0; i < stats.quantData; i++) {
        if ($('#list_' + i).val() == '') {
            valid == false
        }
    }

    if ($('input:radio[name=type]:checked').val() == undefined) {
        alert('Seleccione el tipo de varianza');
    } else if (!valid) {
        alert('Por favor complete todos los campos');
    } else {
        stats.listData = [];
        for (let i = 0; i < stats.quantData; i++) {
            stats.listData.push(parseFloat($('#list_' + i).val()));
        }
        stats.listData = stats.bubbleSort(stats.listData);
        stats.setIntervalsData($('#quantIntervalTxt').val());
        stats.type = $('#type').val();
        stats.setFreqTable();
        $('#freqTable').html(stats.printTable());
        // console.log('html',stats.printTable());



        $('#listString').html(stats.listData.join(' | '));
        $('#mediaString').html(stats.media());
        $('#modaString').html(stats.moda());
        $('#medianaString').html(stats.mediana());
        $('#sumFreqsString').html(stats.sumFreqs);
        $('#xMediaString').html(stats.xMedia);
        $('#varianzaString').html(stats.varianza());
        $('#desviacionString').html(stats.desviacion());
        $('#cvarString').html(stats.factorVariacion() + ' = ' + (stats.factorVariacion() / 100).toFixed(3) + '%');
        $('#resCol').show();


        // console.log('freqTable',stats.freqTable);
        console.log('intervals', stats.intervals);
        console.log('min', stats.min);
        console.log('intervalSize', stats.intervalSize);
    }
}


let stats = new Stats();
$('#resBtn').hide();
$('#resCol').hide();
$('#typeDiv').hide();